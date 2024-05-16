function toggleCustomXpInput() {
    const xpAmount = document.getElementById('xpAmount').value;
    const customXpSection = document.getElementById('customXpSection');
    if (xpAmount === 'custom') {
        customXpSection.style.display = 'block';
    } else {
        customXpSection.style.display = 'none';
    }
}

async function generateStrings() {
    const numStrings = parseInt(document.getElementById('numStrings').value, 10);
    const xpAmountSelect = document.getElementById('xpAmount');
    let xpAmount = xpAmountSelect.value;
    if (xpAmount === 'custom') {
        xpAmount = parseInt(document.getElementById('customXpAmount').value, 10);
    }
    const output = document.getElementById('output');

    if (isNaN(numStrings) || numStrings < 1 || isNaN(xpAmount) || xpAmount < 1) {
        output.textContent = '❌ 无效的输入';
        return;
    }

    try {
        const response = await fetch('/generate-strings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numStrings, xpAmount }),
        });
        const result = await response.json();
        if (result.success) {
            output.textContent = `✅ 成功生成 ${numStrings} 张卡密`;
            document.getElementById('lineCount').textContent = result.lineCount;
        } else {
            output.textContent = `❌ 生成失败: ${result.message}`;
        }
    } catch (error) {
        output.textContent = `❌ 生成失败: ${error.message}`;
    }
}

async function fetchLineCount() {
    try {
        const response = await fetch('/get-line-count');
        const result = await response.json();
        if (result.success) {
            document.getElementById('lineCount').textContent = result.lineCount;
        } else {
            console.error('Failed to fetch line count:', result.message);
        }
    } catch (error) {
        console.error('Error fetching line count:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchLineCount);
