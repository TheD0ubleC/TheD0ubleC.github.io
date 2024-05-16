// 手动设置每次任务后的等待时间（毫秒）
const delayBetweenTasks = 1; // 例如，等待 2 秒

function toggleInputs(useDates) {
    const dateInputs = document.getElementById('dateInputs');
    const loopInput = document.getElementById('loopInput');
    const container = document.getElementById('container');

    if (useDates) {
        dateInputs.classList.remove('hidden');
        loopInput.classList.add('hidden');
        container.style.maxHeight = '600px'; // 目标高度
    } else {
        dateInputs.classList.add('hidden');
        loopInput.classList.remove('hidden');
        container.style.maxHeight = '500px'; // 初始高度
    }
}

async function handleDuolingoSession() {
    const jwt = document.getElementById('jwt').value;
    const numLoops = parseInt(document.getElementById('numLoops').value, 10);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const useDates = document.getElementById('specifyDate').checked;
    const output = document.getElementById('output');
    const progress = document.querySelector('.progress');
    const progressCount = document.getElementById('progressCount');
    const totalCount = document.getElementById('totalCount');
    const xpCount = document.getElementById('xpCount');

    if (!jwt) {
        output.textContent = '❌ JWT 不能为空';
        return;
    }

    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        };

        const decodedJWT = atob(jwt.split(".")[1]);
        const { sub } = JSON.parse(decodedJWT);

        const responseUser = await fetch(
            `https://www.duolingo.com/2017-06-30/users/${sub}?fields=fromLanguage,learningLanguage`,
            { headers },
        );
        const { fromLanguage, learningLanguage } = await responseUser.json();

        let xp = 0;
        let days = 0;

        output.textContent = '';
        document.querySelectorAll('input, button').forEach(el => el.disabled = true);
        progress.classList.remove('hidden');

        if (useDates) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            totalCount.textContent = totalDays;

            for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
                xp += await performSession(day, headers, fromLanguage, learningLanguage, delayBetweenTasks);
                days++;
                progressCount.textContent = days;
                xpCount.textContent = xp;
            }

            output.textContent = `🎉 经过 ${days} 天，你共获得了 ${xp} XP`;
        } else {
            totalCount.textContent = numLoops;

            for (let i = 0; i < numLoops; i++) {
                xp += await performSession(new Date(), headers, fromLanguage, learningLanguage, delayBetweenTasks);
                days++;
                progressCount.textContent = days;
                xpCount.textContent = xp;
            }

            output.textContent = `🎉 经过 ${days} 次，你共获得了 ${xp} XP`;
        }
    } catch (error) {
        console.error("❌ 出错了");
        if (error instanceof Error) {
            output.textContent = `❌ ${error.message}`;
        }
    } finally {
        document.querySelectorAll('input, button').forEach(el => el.disabled = false);
        progress.classList.add('hidden');
    }
}

async function performSession(date, headers, fromLanguage, learningLanguage, delay) {
    const dayStart = new Date(date).setHours(0, 0, 0, 0) / 1000;
    const dayEnd = new Date(date).setHours(23, 59, 59, 999) / 1000;

    try {
        const sessionResponse = await fetch(
            "https://www.duolingo.com/2017-06-30/sessions",
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    challengeTypes: [
                        "assist",
                        "characterIntro",
                        "characterMatch",
                        "characterPuzzle",
                        "characterSelect",
                        "characterTrace",
                        "characterWrite",
                        "completeReverseTranslation",
                        "definition",
                        "dialogue",
                        "extendedMatch",
                        "extendedListenMatch",
                        "form",
                        "freeResponse",
                        "gapFill",
                        "judge",
                        "listen",
                        "listenComplete",
                        "listenMatch",
                        "match",
                        "name",
                        "listenComprehension",
                        "listenIsolation",
                        "listenSpeak",
                        "listenTap",
                        "orderTapComplete",
                        "partialListen",
                        "partialReverseTranslate",
                        "patternTapComplete",
                        "radioBinary",
                        "radioImageSelect",
                        "radioListenMatch",
                        "radioListenRecognize",
                        "radioSelect",
                        "readComprehension",
                        "reverseAssist",
                        "sameDifferent",
                        "select",
                        "selectPronunciation",
                        "selectTranscription",
                        "svgPuzzle",
                        "syllableTap",
                        "syllableListenTap",
                        "speak",
                        "tapCloze",
                        "tapClozeTable",
                        "tapComplete",
                        "tapCompleteTable",
                        "tapDescribe",
                        "translate",
                        "transliterate",
                        "transliterationAssist",
                        "typeCloze",
                        "typeClozeTable",
                        "typeComplete",
                        "typeCompleteTable",
                        "writeComprehension",
                    ],
                    fromLanguage,
                    isFinalLevel: false,
                    isV2: true,
                    juicy: true,
                    learningLanguage,
                    smartTipsVersion: 2,
                    type: "GLOBAL_PRACTICE",
                })
            },
        );
        const session = await sessionResponse.json();

        const responseSession = await fetch(
            `https://www.duolingo.com/2017-06-30/sessions/${session.id}`,
            {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    ...session,
                    heartsLeft: 0,
                    startTime: dayStart,
                    enableBonusPoints: false,
                    endTime: dayEnd,
                    failed: false,
                    maxInLessonStreak: 9,
                    shouldLearnThings: true,
                }),
            },
        );
        const result = await responseSession.json();

        await new Promise(resolve => setTimeout(resolve, delay)); // 等待指定的延迟时间

        return result.xpGain;
    } catch (error) {
        if (error.message.includes("Rate limit exceeded")) {
            console.warn("Rate limit exceeded, retrying...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待 1 秒后重试
            return performSession(date, headers, fromLanguage, learningLanguage, delay);
        } else {
            throw error;
        }
    }
}
