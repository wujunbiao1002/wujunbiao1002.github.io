document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const addMemoryBtn = document.getElementById('addMemoryBtn');
    const memoryForm = document.getElementById('memoryForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const newMemoryForm = document.getElementById('newMemoryForm');
    const timeline = document.querySelector('.timeline');

    // 点击添加按钮显示表单
    addMemoryBtn.addEventListener('click', function() {
        memoryForm.classList.remove('hidden');
        addMemoryBtn.classList.add('hidden');
        
        // 滚动到表单位置
        memoryForm.scrollIntoView({ behavior: 'smooth' });
    });

    // 点击取消按钮隐藏表单
    cancelBtn.addEventListener('click', function() {
        memoryForm.classList.add('hidden');
        addMemoryBtn.classList.remove('hidden');
    });

    // 提交表单处理
    newMemoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const date = document.getElementById('memoryDate').value;
        const title = document.getElementById('memoryTitle').value;
        const description = document.getElementById('memoryDesc').value;
        const imageFile = document.getElementById('memoryImage').files[0];
        
        // 创建新的记忆节点
        addNewMemory(date, title, description, imageFile);
        
        // 重置表单并隐藏
        newMemoryForm.reset();
        memoryForm.classList.add('hidden');
        addMemoryBtn.classList.remove('hidden');
    });

    // 添加新记忆到时间轴
    function addNewMemory(date, title, description, imageFile) {
        // 创建新的时间轴项目
        const newItem = document.createElement('div');
        newItem.className = 'timeline-item';
        
        // 格式化日期显示
        const formattedDate = formatDate(date);
        
        // 构建HTML内容
        let itemContent = `
            <div class="timeline-date">
                <span class="date">${formattedDate}</span>
            </div>
            <div class="timeline-content">
                <h3>${title}</h3>
                <p>${description}</p>
        `;
        
        // 如果有图片，添加图片元素
        if (imageFile) {
            const imgUrl = URL.createObjectURL(imageFile);
            itemContent += `
                <div class="timeline-gallery">
                    <img src="${imgUrl}" alt="${title}" class="timeline-image">
                </div>
            `;
        }
        
        // 关闭内容div
        itemContent += `</div>`;
        
        // 设置HTML内容
        newItem.innerHTML = itemContent;
        
        // 添加到时间轴最前面
        timeline.insertBefore(newItem, timeline.firstChild);
        
        // 添加出现动画效果
        setTimeout(() => {
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, 10);
        
        // 保存到本地存储
        saveMemoryToLocalStorage(date, title, description, imageFile);
    }

    // 格式化日期显示
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return `${year}年${month}月${day}日`;
    }

    // 保存记忆到本地存储
    function saveMemoryToLocalStorage(date, title, description, imageFile) {
        // 获取现有记忆
        let memories = JSON.parse(localStorage.getItem('loveMemories')) || [];
        
        // 创建新记忆对象
        const newMemory = {
            date: date,
            title: title,
            description: description,
            // 注意：这里只保存日期，实际项目中可能需要服务器存储图片
            hasImage: imageFile ? true : false,
            createdAt: new Date().toISOString()
        };
        
        // 添加到记忆数组
        memories.unshift(newMemory);
        
        // 保存回本地存储
        localStorage.setItem('loveMemories', JSON.stringify(memories));
    }

    // 从本地存储加载记忆
    function loadMemoriesFromLocalStorage() {
        const memories = JSON.parse(localStorage.getItem('loveMemories')) || [];
        
        if (memories.length > 0) {
            // 清空示例内容
            timeline.innerHTML = '';
            
            // 添加保存的记忆
            memories.forEach(memory => {
                const newItem = document.createElement('div');
                newItem.className = 'timeline-item';
                
                const formattedDate = formatDate(memory.date);
                
                let itemContent = `
                    <div class="timeline-date">
                        <span class="date">${formattedDate}</span>
                    </div>
                    <div class="timeline-content">
                        <h3>${memory.title}</h3>
                        <p>${memory.description}</p>
                `;
                
                if (memory.hasImage) {
                    // 实际项目中，这里需要从服务器获取图片
                    itemContent += `
                        <div class="timeline-gallery">
                            <img src="./images/placeholder.jpg" alt="${memory.title}" class="timeline-image">
                        </div>
                    `;
                }
                
                itemContent += `</div>`;
                
                newItem.innerHTML = itemContent;
                timeline.appendChild(newItem);
            });
        }
    }

    // 页面加载时从本地存储加载记忆
    loadMemoriesFromLocalStorage();

    // 添加图片预览功能
    document.getElementById('memoryImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            // 可以在这里添加预览图片的代码
            console.log('已选择图片：', file.name);
        }
    });

    // 添加点击图片放大功能
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('timeline-image')) {
            // 创建全屏预览
            const fullscreen = document.createElement('div');
            fullscreen.className = 'fullscreen-preview';
            fullscreen.innerHTML = `
                <div class="preview-container">
                    <img src="${e.target.src}" alt="${e.target.alt}">
                    <button class="close-preview">×</button>
                </div>
            `;
            document.body.appendChild(fullscreen);
            
            // 防止滚动
            document.body.style.overflow = 'hidden';
            
            // 关闭预览
            fullscreen.addEventListener('click', function(e) {
                if (e.target.classList.contains('fullscreen-preview') || 
                    e.target.classList.contains('close-preview')) {
                    document.body.removeChild(fullscreen);
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // 添加全屏预览的样式
    const style = document.createElement('style');
    style.textContent = `
        .fullscreen-preview {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .preview-container {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .preview-container img {
            max-width: 100%;
            max-height: 90vh;
            border: 5px solid white;
            border-radius: 5px;
        }
        
        .close-preview {
            position: absolute;
            top: -20px;
            right: -20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ff85a2;
        }
    `;
    document.head.appendChild(style);
}); 