const imgPath = 'img/'
const desktop = document.getElementById('desktop');
const desktopFolder = document.getElementById('desktop-folder');
const miscFolder = document.getElementById('misc-folder');
const windowTemplate = document.getElementById('windowTemplate').content;
const selectionBox = document.getElementById('selectionBox');

let newWindowOffset = 23;
let zIndexCounter = 1;
let activeTop = 70;
let activeLeft = 60;
let isSelecting = false;
let startX, startY;
let singletons = { 'snake.exe': null };

const files = {
    'keyhan': {
        'experience': {
            'files': ['AcuityAds.txt', 'Paymentus.txt', 'AWS.txt'] },
        'projects': { 
            'phorym': 
                {'files': ['README.txt', 'phorym.webloc']}, 
            'aitify': 
                {'files': ['README.txt', 'aitify.webloc']}, 
            'files': ['kilxn.txt'] },
        'files': ['education.txt', 'skills.txt', 'about.txt']
    },
    'misc': {
        'files': [ 'snake.exe' ]
    }
};
const navigationHistory = new Map();

desktop.addEventListener('mousedown', handleMouseDown);
desktop.addEventListener('dblclick', handleDoubleClick);
desktop.addEventListener('mousemove', handleMouseMove);
desktop.addEventListener('mouseup', handleMouseUp);

function getFiles(path) {
    return path.split('/').reduce((current, part) => (part in current ? current[part] : null), files);
}

function handleMouseDown(e) {
    const target = e.target.closest('.folder, .file, .window, #desktop');
    const folderImg = desktopFolder.querySelector('img');
    const folderSpan = desktopFolder.querySelector('span');
    const miscImg = miscFolder.querySelector('img');
    const miscSpan = miscFolder.querySelector('span');
    
    if (target === desktopFolder) {
        folderImg.classList.add('selected-icon');
        folderSpan.classList.add('selected-span');
        miscImg.classList.remove('selected-icon');
        miscSpan.classList.remove('selected-span');
    } else if (target === miscFolder) {
        miscImg.classList.add('selected-icon');
        miscSpan.classList.add('selected-span');
        folderImg.classList.remove('selected-icon');
        folderSpan.classList.remove('selected-span');
    } else if (target === desktop) {
        miscImg.classList.remove('selected-icon');
        miscSpan.classList.remove('selected-span');
        folderImg.classList.remove('selected-icon');
        folderSpan.classList.remove('selected-span');
    }
    if (e.target === desktop) {
        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;
        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        selectionBox.style.display = '';
    }
}

function handleDoubleClick(e) {
    const target = e.target.closest('.folder, .file');
    if (target) {
        const path = target.dataset.path;
        const type = target.dataset.type;
        if (type !== 'folder') {
            openWindow(type, path);
        } else {
            const windowElement = e.target.closest('.window');
            if (windowElement) {
                openFolder(path, windowElement);
            } else {
                openWindow(type, path);
            }
        }
    }
}

function handleMouseMove(e) {
    if (isSelecting) {
        updateSelectionBox(e.clientX, e.clientY);
        updateFolderSelection();
    }
}

function handleMouseUp() {
    isSelecting = false;
    selectionBox.style.width = '0';
    selectionBox.style.height = '0';
    selectionBox.style.display = 'none';
}

function updateSelectionBox(currentX, currentY) {
    selectionBox.style.width = `${Math.abs(currentX - startX)}px`;
    selectionBox.style.height = `${Math.abs(currentY - startY)}px`;
    selectionBox.style.left = `${Math.min(currentX, startX)}px`;
    selectionBox.style.top = `${Math.min(currentY, startY)}px`;
}

function updateFolderSelection() {
    const { left: fLeft, right: fRight, top: fTop, bottom: fBottom } = desktopFolder.getBoundingClientRect();
    const { left: mLeft, right: mRight, top: mTop, bottom: mBottom } = miscFolder.getBoundingClientRect();
    const { left: sLeft, right: sRight, top: sTop, bottom: sBottom } = selectionBox.getBoundingClientRect();
    const folderImg = desktopFolder.querySelector('img');
    const folderSpan = desktopFolder.querySelector('span');
    const miscImg = miscFolder.querySelector('img');
    const miscSpan = miscFolder.querySelector('span');
    
    if (fRight >= sLeft && fLeft <= sRight && fBottom >= sTop && fTop <= sBottom) {
        folderImg.classList.add('selected-icon');
        folderSpan.classList.add('selected-span');
    } else {
        folderImg.classList.remove('selected-icon');
        folderSpan.classList.remove('selected-span');
    }
    if (mRight >= sLeft && mLeft <= sRight && mBottom >= sTop && mTop <= sBottom) {
        miscImg.classList.add('selected-icon');
        miscSpan.classList.add('selected-span');
    } else {
        miscImg.classList.remove('selected-icon');
        miscSpan.classList.remove('selected-span');
    }
}

function openWindow(type, path) {
    const newWindow = windowTemplate.cloneNode(true);
    const windowElement = newWindow.querySelector('.window');
    const titleElement = newWindow.querySelector('.window-title');
    const contentElement = newWindow.querySelector('.window-content');
    const filename = path.split('/').pop();

    windowElement.style.zIndex = zIndexCounter++;
    windowElement.style.top = `${activeTop + newWindowOffset}px`;
    windowElement.style.left = `${activeLeft + newWindowOffset}px`;
    windowElement.classList.add(filename);
    titleElement.textContent = filename;
    activeLeft += newWindowOffset;
    activeTop += newWindowOffset;

    if (type === 'folder') {
        openFolder(path, windowElement);
        desktop.appendChild(newWindow);
    } else if (type === 'file') {
        windowElement.classList.add('textfile');
        contentElement.innerHTML = `<textarea class="textfile" style="width: 100%; height: 100%;">${getFileContents(path)}</textarea>`;
        desktop.appendChild(newWindow);
    } else if (type === 'website') {
        windowElement.classList.add('website');
        contentElement.innerHTML = `<iframe class="website_iframe" src="${getFileContents(path)}"></iframe>`;
        desktop.appendChild(newWindow);
    } else if (type === 'exe') {
        if (!singletons[filename]) {
            newWindow.querySelector('.window-navigation').remove();
            newWindow.querySelector('.window-footer').remove();
            contentElement.innerHTML = `<canvas id="${filename}Canvas" width="400" height="400"></canvas>`;
            desktop.appendChild(newWindow);
            singletons[filename] = windowElement;
        } else {
            bringToFront(singletons[filename]);
            if (!desktop.contains(singletons[filename])) {
                desktop.appendChild(singletons[filename]);
            }
            singletons[filename].style.display = 'flex'
        }
        getFileContents(path)();
    }

    addWindowEventListeners(windowElement);
}

function navigateBack(button) {
    const windowElement = button.closest('.window');
    const history = navigationHistory.get(windowElement) || { back: [], forward: [] };

    if (history.back.length > 0) {
        const currentPath = history.back.pop();
        const previousPath = history.back.pop();
        history.forward.push(currentPath);
        navigationHistory.set(windowElement, history);
        openFolder(previousPath, windowElement, false);
    }

    updateNavigationButtons(windowElement, history);
}

function navigateForward(button) {
    const windowElement = button.closest('.window');
    const history = navigationHistory.get(windowElement) || { back: [], forward: [] };

    if (history.forward.length > 0) {
        const nextPath = history.forward.pop();
        openFolder(nextPath, windowElement, false);
    }

    updateNavigationButtons(windowElement, history);
}

function openFolder(path, windowElement, newNavigation=true) {
    const contentElement = windowElement.querySelector('.window-content');
    const breadcrumbElement = windowElement.querySelector('.breadcrumb');

    const folderContents = getFiles(path);
    breadcrumbElement.innerHTML = '';
    breadcrumbElement.appendChild(createBreadcrumb(path));

    const history = navigationHistory.get(windowElement) || { back: [], forward: [] };
    history.back.push(path);
    if (newNavigation) {
        history.forward = [];
    }

    navigationHistory.set(windowElement, history);
    updateNavigationButtons(windowElement, history);

    if (folderContents) {
        let innerHTML = '<div class="main-content">';
        for (let folder in folderContents) {
            if (folder !== 'files') {
                innerHTML += `
                    <div class="folder" data-type="folder" data-path="${path}/${folder}">
                        <img src="${imgPath}folder-icon.png" alt="Folder">
                        <span>${folder}</span>
                    </div>`;
            }
        }
        if ('files' in folderContents) {
            for (let file of folderContents.files) {
                if (file.endsWith('.webloc')) {
                    innerHTML += `
                        <div class="file" data-type="website" data-path="${path}/${file}">
                            <img src="${imgPath}website-icon.png" alt="File">
                            <span>${file}</span>
                        </div>`;
                } else if (file.endsWith('.exe')) {
                    innerHTML += `
                        <div class="file" data-type="exe" data-path="${path}/${file}">
                            <img src="${imgPath}exe-icon.png" alt="File">
                            <span>${file}</span>
                        </div>`;
                } else {
                    innerHTML += `
                        <div class="file" data-type="file" data-path="${path}/${file}">
                            <img src="${imgPath}file-icon.png" alt="File">
                            <span>${file}</span>
                        </div>`;
                }
            }
        }
        innerHTML += '</div>';
        contentElement.innerHTML = innerHTML;
    }
}

function updateNavigationButtons(windowElement, history) {
    const backBtn = windowElement.querySelector('.window-navigation .back');
    const forwardBtn = windowElement.querySelector('.window-navigation .forward');

    backBtn.disabled = history.back.length < 2;
    forwardBtn.disabled = history.forward.length === 0;
}

function createBreadcrumb(path) {
    const breadcrumbElement = document.createElement('span');
    const paths = path.split('/');
    let pointerHTML = `<img class="breadcrumb_pointer" src="img/breadcrumb-pointer.png">`;
    let breadcrumbHTML = '';
    let accumulatedPath = '';

    paths.forEach((part, index) => {
        accumulatedPath += (index > 0 ? '/' : '') + part;
        breadcrumbHTML += ``
        breadcrumbHTML += `<span class="breadcrumb-part" onclick="openFolder('${accumulatedPath}', this.closest('.window'))"><img class="breadcrumb_icon" src="img/breadcrumb-icon.png">${part}${pointerHTML}</span>`;
    });

    breadcrumbElement.innerHTML = breadcrumbHTML.slice(0, -pointerHTML.length);
    return breadcrumbElement;
}

function addWindowEventListeners(windowElement) {
    windowElement.querySelector('.close').addEventListener('click', () => windowElement.remove());
    windowElement.querySelector('.minimize').addEventListener('click', () => windowElement.style.display = 'none');
    windowElement.querySelector('.maximize').addEventListener('click', () => maximizeWindow(windowElement));
    windowElement.addEventListener('mousedown', () => bringToFront(windowElement));
    makeResizable(windowElement);
    makeDraggable(windowElement.querySelector('.window-header'), windowElement);
}

function maximizeWindow(windowElement) {
    windowElement.style.width = '100%';
    windowElement.style.height = '100%';
    windowElement.style.top = '0';
    windowElement.style.left = '0';
}

function bringToFront(windowElement) {
    windowElement.style.zIndex = zIndexCounter++;
    updateActiveCoords(windowElement);
}

function makeResizable(element) {
    element.style.resize = 'both';
    element.style.overflow = 'auto';
}

function makeDraggable(header, element) {
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        updateActiveCoords(element);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        updateActiveCoords(element);
    }
}

function updateActiveCoords(element) {
    activeTop = element.getBoundingClientRect().top;
    activeLeft = element.getBoundingClientRect().left;
}

function getFileContents(path) {
    const contents = {
        'keyhan/education.txt':
            'University of Toronto\n' +
            'Bachelor of Science\n' +
            'Graduated with distinction\n' +
            'Computer science double major\n' + 
            'Additional cognitive science major\n' +
            'September 2014 – May 2019',        
        'keyhan/skills.txt':
            '- Java\n- Javascript\n- Python\n- Ruby\n- SQL\n- HTML\n- CSS\n- TypeScript\n- shell scripting\n- AWS technologies\n- Spring\n- Node\n- Flask\n' +
            '- Experienced with Agile, Scrum, and Kanban methodologies and collaborative tools like Git, JIRA, and Asana\n' +
            '- Green thumbed, loves taking care of my many plants\n- Training for a half-marathon this coming autumn\n- Antique & history enthusiast',
        'keyhan/about.txt':
            'My name is Keyhan Rezvani. Welcome.\nToronto, ON\nJuly 2024\nWebsite by yours truly & under construction.\n\n' +
            'Known bugs:\n' +
            '- iframes consume mouse events e.g can\'t refocus an iframe window by clicking on the contents\n' +
            '- Snake game controls are applied even when window is not active\n' +
            '\n' + 
            'TODO:\n' +
            '- Snake game should have walls, game should start on first keydown\n' +
            '- Make responsive/mobile version\n' +
            '- Ability to move folders/files\n' +
            '- Hover for window control details\n' +
            '- Resize windows from any corner/side\n' +
            '- Maximize window should be reversible\n' +
            '- Add dock\n' +
            '- Add games\n' +
            '- Separate content from code',
        'keyhan/projects/phorym/phorym.webloc':
            'https://phorym.com',
        'keyhan/projects/phorym/README.txt': 
            '***NOTE***\nYou can not log in through the .webloc in this folder. You must visit Phorym directly (phorym.com) to login and access all features.\n\n' +
            'https://phorym.com\n\nJanuary 2021 - present\n\n' +
            '- Dynamic community-building forum which hosts 500+ users and tens of thousands of posts.\n\n' +
            '- Server runs on an AWS EC2 instance using Express in NodeJS with a MongoDB, and Three.js graphics.\n\n' +
            '- Curates topic feeds per user based on chat styles using NLP.\n\n' +
            '- Algorithm uses a statistical model to analyze posts to determine keywords for calculating relevance in realtime.\n\n' +
            '- Separate and secure administrator interface for moderating posts, users, and IP addresses.\n\n' + 
            '- JSON web tokens ensure account authentication and authorization.\n\n' +
            '- Follows HTTPS, web traffic is encrypted using TLS.\n\n' +
            '- Conceived, created, and maintained independently as a passion project.',
        'keyhan/projects/aitify/aitify.webloc':
            'https://aitify.app/',
        'keyhan/projects/aitify/README.txt': 
            '***NOTE***\nAccess is limited at the moment, if you\'re interested in seeing it please let me know!\n\n' +
            'Insurance broker assistant & toolbox\nJuly 2024\n\n' +
            '- Flask server written in Python running on an AWS EC2 instance with a Angular 18 TypeScript frontend.\n\n' +
            '- Utilizes OpenAI’s Assistants API to make use of LLMs.\n\n' +
            '- S3 blob storage for insurance documents in user knowledge bases.\n\n' +
            '- Provides insurance-specific solutions like policy comparison, summarization, knowledge base querying, and meeting note-taking.',
        'keyhan/projects/kilxn.txt': 
            'Chrome extension\nhttps://chromewebstore.google.com/detail/kilxn/aajbjhafaaaabakjnhngiblipmmkpedf\nNovember 2015\n\n' +
            '- Lightweight browser extension for locally storing and indexing image URLs for ease of access.\n\n' +
            '- Published in the Chrome Web Store.',
        'keyhan/experience/AWS.txt':
            'System Development Engineer\nSeattle, WA\nDecember 2021 - May 2023\n\n' + 
            '- Planned and developed a framework which synchronizes initialization of dozens of AWS resources (EC2 servers, VPCs, CloudWatch, IAM profiles, SQS, etc), automating service builds for new regions.\n\n' + 
            '- Increased efficiency and reduced developer efforts from months to weeks (over 70%) within AWS Config using native AWS technologies and Ruby to automate service builds.\n\n' +
            '- Maintained pipelines, version sets, and deployments shared between multiple teams within AWS Config.\n\n' +
            '- Maintained and developed on the organization’s main server entry point running on Spring Framework in Java.\n\n' + 
            '- Investigated and resolved availability issues during week-long 24h oncall shifts.\n\n',
        'keyhan/experience/AcuityAds.txt': 
            'Java Developer\nToronto, ON\nMay 2017 - May 2018\n\n' + '- Implemented features across the stack which are used by advertising agencies to target audiences programmatically.\n\n' +
            '- Implemented programmatic audience targeting features across the stack which are used by advertising agencies.\n\n' +
            '- Implemented an interface for clients to target audiences experiencing certain weather conditions with specific ads.\n\n' +
            '- Developed and optimized a custom metric summarization feature in Druid dealing with millions of records.\n\n' +
            '- Located bugs and applied fixes across the stack, from the browser to the ad-space bidder.\n\n' +
            '- Worked with Java, Spring, and SQL for the backend and AngularJS for the frontend.',
        'keyhan/experience/Paymentus.txt': 
            'QA Automation Engineer\nRichmond Hill, ON\nSeptember 2019 - January 2021\n\n' +
            '- Developed and deployed automated E2E test scripts to CI/CD pipelines to verify full functionality of releases, increasing test coverage by 30%.\n\n' +
            '- Reduced test suite runtime from 4 hours to 30 minutes using thread parallelization.\n\n' +
            '- Enhanced test reporting to better explain failing test scenarios and save developer time in pinpointing bugs.\n\n' +
            '- Analyzed test reports daily and before releases to mitigate and troubleshoot regression.\n\n' +
            '- Maintained and improved automation frameworks using Jest, Puppeteer, NodeJS, and Selenium, BrowserStack, Jenkins, and Javascript and Java.',
        'misc/snake.exe':
            startSnakeGame
    };
    return contents[path] || 'File contents';
}

let snakeInterval;

function startSnakeGame() {
    const canvas = document.getElementById('snake.exeCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let direction = { x: 1, y: 0 };
    let nextDirection = { ...direction };

    // Clear previous game interval if one exists
    if (snakeInterval) {
        clearInterval(snakeInterval);
    }

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Remove previous keydown event listener
    document.removeEventListener('keydown', handleKeydown);

    // Add a fresh keydown event listener for controlling the snake
    document.addEventListener('keydown', handleKeydown);

    function handleKeydown(e) {
        if (e.key === 'ArrowUp' && direction.y === 0) {
            nextDirection = { x: 0, y: -1 };
        } else if (e.key === 'ArrowDown' && direction.y === 0) {
            nextDirection = { x: 0, y: 1 };
        } else if (e.key === 'ArrowLeft' && direction.x === 0) {
            nextDirection = { x: -1, y: 0 };
        } else if (e.key === 'ArrowRight' && direction.x === 0) {
            nextDirection = { x: 1, y: 0 };
        }
    }

    function gameLoop() {
        direction = { ...nextDirection };

        // Calculate new snake head
        const newHead = {
            x: (snake[0].x + direction.x + tileCount) % tileCount,
            y: (snake[0].y + direction.y + tileCount) % tileCount,
        };

        // Check collision with the body
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            gameOver();
            return;
        }

        // Add the new head
        snake.unshift(newHead);

        // Check if snake eats the food
        if (newHead.x === food.x && newHead.y === food.y) {
            // Generate new food at a random position
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount),
            };
        } else {
            // Remove the last part of the snake (tail)
            snake.pop();
        }

        // Clear the canvas for the new frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

        // Draw the snake
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    function gameOver() {
        clearInterval(snakeInterval);
        ctx.fillStyle = 'red';
        ctx.font = 'bold 30px Courier New';
        ctx.fillText('GAME OVER', canvas.width / 4 + 20, canvas.height / 2);
    }

    // Start the game loop
    snakeInterval = setInterval(gameLoop, 100);
}
