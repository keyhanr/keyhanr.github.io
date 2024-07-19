const imgPath = 'img/'
const desktop = document.getElementById('desktop');
const desktopFolder = document.getElementById('desktop-folder');
const windowTemplate = document.getElementById('windowTemplate').content;
const selectionBox = document.getElementById('selectionBox');

let newWindowOffset = 23;
let zIndexCounter = 1;
let activeTop = 70;
let activeLeft = 60;
let isSelecting = false;
let startX, startY;

const files = {
    'keyhan': {
        'experience': { 'files': ['AWS.txt', 'AcuityAds.txt', 'Paymentus.txt'] },
        'projects': { 'phorym': {'files': ['README.txt', 'phorym.webloc']}, 'files': ['kilxn.txt', 'insurance assistant.txt'] },
        'files': ['education.txt', 'about.txt']
    }
};

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
    
    if (target === desktopFolder) {
        folderImg.classList.add('selected-icon');
        folderSpan.classList.add('selected-span');
    } else if (target === desktop) {
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
    const { left: sLeft, right: sRight, top: sTop, bottom: sBottom } = selectionBox.getBoundingClientRect();
    const folderImg = desktopFolder.querySelector('img');
    const folderSpan = desktopFolder.querySelector('span');
    
    if (fRight >= sLeft && fLeft <= sRight && fBottom >= sTop && fTop <= sBottom) {
        folderImg.classList.add('selected-icon');
        folderSpan.classList.add('selected-span');
    } else {
        folderImg.classList.remove('selected-icon');
        folderSpan.classList.remove('selected-span');
    }
}

function openWindow(type, path) {
    const newWindow = windowTemplate.cloneNode(true);
    const windowElement = newWindow.querySelector('.window');
    const titleElement = newWindow.querySelector('.window-title');
    const contentElement = newWindow.querySelector('.window-content');

    windowElement.style.zIndex = zIndexCounter++;
    windowElement.style.top = `${activeTop + newWindowOffset}px`;
    windowElement.style.left = `${activeLeft + newWindowOffset}px`;
    activeLeft += newWindowOffset;
    activeTop += newWindowOffset;

    if (type === 'folder') {
        openFolder(path, windowElement);
        titleElement.textContent = path.split('/').pop();
    } else if (type === 'file') {
        windowElement.classList.add('textfile');
        titleElement.textContent = path.split('/').pop();
        contentElement.innerHTML = `<textarea class="textfile" style="width: 100%; height: 100%;">${getFileContents(path)}</textarea>`;
    } else if (type === 'website') {
        windowElement.classList.add('website');
        titleElement.textContent = path.split('/').pop();
        contentElement.innerHTML = `<iframe class="website_iframe" src="${getFileContents(path)}"></iframe>`;
    }

    addWindowEventListeners(windowElement);
    desktop.appendChild(newWindow);
}

function openFolder(path, windowElement) {
    const contentElement = windowElement.querySelector('.window-content');
    const breadcrumbElement = windowElement.querySelector('.breadcrumb');

    const folderContents = getFiles(path);
    breadcrumbElement.innerHTML = '';
    breadcrumbElement.appendChild(createBreadcrumb(path));

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

function createBreadcrumb(path) {
    const breadcrumbElement = document.createElement('span');
    const paths = path.split('/');
    let breadcrumbHTML = '';
    let accumulatedPath = '';
    paths.forEach((part, index) => {
        accumulatedPath += (index > 0 ? '/' : '') + part;
        breadcrumbHTML += `<span onclick="openFolder('${accumulatedPath}', this.closest('.window'))">${part}</span> > `;
    });
    breadcrumbElement.innerHTML = breadcrumbHTML.slice(0, -3);
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
        'keyhan/about.txt':
            'My name is Keyhan Rezvani. Welcome.\nToronto, ON\nJuly 2024\nWebsite by yours truly & under construction.\n\n' +
            'Known bugs:\n' +
            '- iframes consume mouse events e.g can\'t refocus an iframe window by clicking on the contents\n' +
            '\n' + 
            'TODO:\n' +
            '- Make responsive/mobile version\n' +
            '- Ability to move folders/files\n' +
            '- Hover for window control details\n' +
            '- Resize windows from any corner/side\n' +
            '- Add navigation arrows to windows\n' +
            '- Maximize window should be reversible\n' +
            '- Add games\n' +
            '- Separate content from code',
        'keyhan/projects/phorym/phorym.webloc':
            'https://phorym.com',
        'keyhan/projects/phorym/README.txt': 
            '***NOTE***\nYou can not log in through the .webloc in this folder. You must visit Phorym directly (phorym.com) to login and access all features.\n\n' +
            'https://phorym.com\n\nJanuary 2021 - present\n\n' +
            '- Dynamic community-building chatspace which hosts 500+ users and tens of thousands of posts.\n\n' +
            '- Web forum which curates topic feeds per user based on chat styles and behaviours using NLP.\n\n' +
            '- Server runs on an AWS EC2 instance using Express in NodeJS with a MongoDB, and Three.js graphics.\n\n' +
            '- Conceived, created, and maintained independently as a passion project.\n\n' +
            '- Algorithm uses a statistical model to analyze posts to determine keywords for calculating relevance in realtime.\n\n' + 
            '- Separate and secure administrator interface for moderating posts, users, and IP addresses.\n\n' +
            '- JSON web tokens ensure account authentication and authorization.\n\n' +
            '- Follows HTTPS, web traffic is encrypted using TLS.',
        'keyhan/projects/kilxn.txt': 
            'Chrome extension\nhttps://chromewebstore.google.com/detail/kilxn/aajbjhafaaaabakjnhngiblipmmkpedf\nNovember 2015\n\n' +
            '- Lightweight browser extension for locally storing and indexing image URLs for ease of access.\n\n' +
            '- Published in the Chrome Web Store.',
        'keyhan/projects/insurance assistant.txt': 
            'Insurance broker assistant\nJuly 2024\n\n' +
            '- Written in Python using Streamlit and OpenAI assistants API\n\n' +
            '- Policy document comparer and summarizer\n\n' +
            '- Knowledge base researcher - upload documents and ask questions',
        'keyhan/experience/AWS.txt':
            'System Development Engineer\nSeattle, WA\nDecember 2021 - May 2023\n\n' + 
            '- Planned and developed a framework synchronizing dozens of resources automating service builds across regions, reducing developer efforts from months to weeks within Config using native AWS technologies and Ruby.\n\n' + 
            '- Simplified deployment architectures and procedures across the AWS Config organization.\n\n' +
            '- Maintained shared pipelines, deployments, and resources within AWS Config.\n\n' +
            '- Handled availability issues during week-long oncall shifts requiring response times under 15 minutes at all hours.',
        'keyhan/experience/AcuityAds.txt': 
            'Java Developer\nToronto, ON\nMay 2017 - May 2018\n\n' + '- Implemented features across the stack which are used by advertising agencies to target audiences programmatically.\n\n' +
            '- Developed and optimized a custom metric summarization feature in Druid dealing with millions of records.\n\n' +
            '- Implemented an interface for clients to target audiences experiencing certain weather conditions with specific ads.\n\n' +
            '- Located bugs and applied fixes across the stack, from the browser to the ad-space bidder.',
        'keyhan/experience/Paymentus.txt': 
            'QA Automation Engineer\nRichmond Hill, ON\nSeptember 2019 - January 2021\n\n' +
            '- Developed and deployed automated test scripts to CI/CD pipelines to verify functionality of releases, increasing test coverage by 30% while reducing test runtime.\n\n' +
            '- Worked on thread parallelization to reduce regression test suite runtime to 30 minutes, down from 4 hours.\n\n' +
            '- Enhanced test reporting to better explain failing test scenarios, analyzed test reports daily to troubleshoot regression.\n\n' +
            '- Maintained and improved automation frameworks using Jest, Puppeteer, NodeJS, and Selenium.'
    };
    return contents[path] || 'File contents';
}
