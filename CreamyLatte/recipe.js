const translations = {
    CN: {
        title: "厚拿铁配方计算器",
        volumeLabel: "总容量 (ml):",
        languageLabel: "语言:",
        calculateButton: "计算",
        recipeTitle: "配方:"
    },
    EN: {
        title: "Creamy Latte Recipe Calculator",
        volumeLabel: "Total Volume (ml):",
        languageLabel: "Language:",
        calculateButton: "Calculate",
        recipeTitle: "Recipe:"
    },
    JP: {
        title: "クリーミーラテのレシピ計算機",
        volumeLabel: "総容量 (ml):",
        languageLabel: "言語:",
        calculateButton: "計算",
        recipeTitle: "レシピ:"
    },
    KR: {
        title: "크리미 라떼 레시피 계산기",
        volumeLabel: "총 용량 (ml):",
        languageLabel: "언어:",
        calculateButton: "계산",
        recipeTitle: "레시피:"
    }
};

function updateLanguage() {
    const language = document.getElementById('language').value;
    const translation = translations[language];

    document.getElementById('title').textContent = translation.title;
    document.getElementById('volume-label').textContent = translation.volumeLabel;
    document.getElementById('language-label').textContent = translation.languageLabel;
    document.getElementById('calculate-button').textContent = translation.calculateButton;
    document.getElementById('recipe-title').textContent = translation.recipeTitle;
}

function CreamyLatte(totalVolume, language) {
    const waterRatio = 150 / 350;
    const instantCoffeeRatio = 8 / 350;
    const condensedMilkRatio = 7 / 350;
    const fullCreamEvaporatedMilkRatio = 100 / 350;
    const freshMilkRatio = 85 / 350;

    const water = waterRatio * totalVolume;
    const instantCoffee = instantCoffeeRatio * totalVolume;
    const condensedMilk = condensedMilkRatio * totalVolume;
    const fullCreamEvaporatedMilk = fullCreamEvaporatedMilkRatio * totalVolume;
    const freshMilk = freshMilkRatio * totalVolume;

    let result;
    switch (language) {
        case "CN":
            result = `配方 ${totalVolume} ML 厚乳拿铁:\n`;
            result += `水: ${water.toFixed(2)} 克\n`;
            result += `速溶咖啡: ${instantCoffee.toFixed(2)} 克\n`;
            result += `炼乳: ${condensedMilk.toFixed(2)} 克\n`;
            result += `全脂淡奶: ${fullCreamEvaporatedMilk.toFixed(2)} 克\n`;
            result += `鲜奶: ${freshMilk.toFixed(2)} 克\n`;
            break;
        case "EN":
            result = `Recipe for ${totalVolume} ML Creamy Latte:\n`;
            result += `Water: ${water.toFixed(2)} grams\n`;
            result += `Instant Coffee: ${instantCoffee.toFixed(2)} grams\n`;
            result += `Condensed Milk: ${condensedMilk.toFixed(2)} grams\n`;
            result += `Full Cream Evaporated Milk: ${fullCreamEvaporatedMilk.toFixed(2)} grams\n`;
            result += `Fresh Milk: ${freshMilk.toFixed(2)} grams\n`;
            break;
        case "JP":
            result = `${totalVolume} MLのクリーミーラテのレシピ:\n`;
            result += `水: ${water.toFixed(2)} グラム\n`;
            result += `インスタントコーヒー: ${instantCoffee.toFixed(2)} グラム\n`;
            result += `練乳: ${condensedMilk.toFixed(2)} グラム\n`;
            result += `全脂エバミルク: ${fullCreamEvaporatedMilk.toFixed(2)} グラム\n`;
            result += `生乳: ${freshMilk.toFixed(2)} グラム\n`;
            break;
        case "KR":
            result = `${totalVolume} ML 크리미 라떼 레시피:\n`;
            result += `물: ${water.toFixed(2)} 그램\n`;
            result += `인스턴트 커피: ${instantCoffee.toFixed(2)} 그램\n`;
            result += `연유: ${condensedMilk.toFixed(2)} 그램\n`;
            result += `전지 증발 우유: ${fullCreamEvaporatedMilk.toFixed(2)} 그램\n`;
            result += `신선한 우유: ${freshMilk.toFixed(2)} 그램\n`;
            break;
        default:
            result = `Recipe for ${totalVolume} ML Creamy Latte:\n`;
            result += `Water: ${water.toFixed(2)} grams\n`;
            result += `Instant Coffee: ${instantCoffee.toFixed(2)} grams\n`;
            result += `Condensed Milk: ${condensedMilk.toFixed(2)} grams\n`;
            result += `Full Cream Evaporated Milk: ${fullCreamEvaporatedMilk.toFixed(2)} grams\n`;
            result += `Fresh Milk: ${freshMilk.toFixed(2)} grams\n`;
            break;
    }

    const recipeElement = document.getElementById('recipe');
    recipeElement.style.opacity = 0;
    recipeElement.textContent = result;
    recipeElement.classList.remove('hidden');
    setTimeout(() => {
        recipeElement.style.opacity = 1;
    }, 10);
}

function calculateRecipe() {
    const volume = parseFloat(document.getElementById('volume').value);
    const language = document.getElementById('language').value;
    CreamyLatte(volume, language);
    updateLanguage();
}

window.onload = updateLanguage;  // Initialize language on page load
