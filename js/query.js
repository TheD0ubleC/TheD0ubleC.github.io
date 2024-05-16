async function queryCard() {
    const queryCode = document.getElementById('queryCode').value.trim();
    const output = document.getElementById('queryOutput');

    if (!queryCode) {
        output.textContent = '❌ 请输入卡密';
        return;
    }

    try {
        const response = await fetch('/query-card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ queryCode }),
        });
        const result = await response.json();
        if (result.success) {
            output.innerHTML = `
                <p>卡密: ${result.card.code}</p>
                <p>额度: ${result.card.xp} XP</p>
                <p>状态: ${result.card.status}</p>
                <p>使用时间: ${result.card.usageTime || '未使用'}</p>
                <button onclick="simulateUsage('${queryCode}')">模拟使用</button>
            `;
        } else {
            output.textContent = `❌ 查询失败: ${result.message}`;
        }
    } catch (error) {
        output.textContent = `❌ 查询失败: ${error.message}`;
    }
}

async function simulateUsage(code) {
    try {
        const response = await fetch('/simulate-usage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        const result = await response.json();
        if (result.success) {
            alert('✅ 模拟使用成功');
            queryCard();  // Refresh the card status
        } else {
            alert(`❌ 模拟使用失败: ${result.message}`);
        }
    } catch (error) {
        alert(`❌ 模拟使用失败: ${error.message}`);
    }
}
