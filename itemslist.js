let allItems = []; 
const ITEMS_PER_PAGE = 20; // 페이지당 아이템 수
let currentPage = 1;       // 현재 페이지

// 1. JSON 데이터 로드
async function loadData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json(); 
        allItems = data.length > 0 ? data : getSampleData();
        
        console.log("데이터 로드 완료:", allItems.length, "개 아이템");
        
        // 데이터 로드 후 전체 목록 표시 시작
        currentPage = 1;
        displayFullList(allItems, currentPage, ITEMS_PER_PAGE);
        renderPagination(allItems.length, ITEMS_PER_PAGE, 'pagination-container', displayFullList);
        
    } catch (error) {
        console.error("아이템 데이터 로드 실패. 샘플 데이터를 사용합니다.", error);
        allItems = getSampleData();
        // 데이터 로드 실패 시에도 전체 목록 표시
        currentPage = 1;
        displayFullList(allItems, currentPage, ITEMS_PER_PAGE);
        renderPagination(allItems.length, ITEMS_PER_PAGE, 'pagination-container', displayFullList);
    }
}

// 2. 샘플 데이터 (script.js의 샘플 데이터와 동일)
function getSampleData() {
    return [
    { "id": 1, "name": "녹슨 톱니 바퀴", "rarity": "Rare", "image_url": "images/gear.png", "count": 216, "find_location": "공업 시설, 폐기물 처리장", "recycling_yield": "금속 부품 x4, 기계 부품 x2" },
          { "id": 2, "name": "스포터 릴레이", "rarity": "Epic", "image_url": "images/relay.png", "count": 203, "find_location": "군사 기지, 아크 잔해", "recycling_yield": "전자 부품 x5, 희귀 자성체 x1" },
          { "id": 3, "name": "가시 배", "rarity": "Rare", "image_url": "images/pear.png", "count": 187, "find_location": "사막 지대, 황무지", "recycling_yield": "섬유 x3" },
          { "id": 4, "name": "고대 핵", "rarity": "Legendary", "image_url": "images/core.png", "count": 12, "find_location": "아크 유적, 봉쇄 구역", "recycling_yield": "알 수 없음" },
          { "id": 5, "name": "표준 연료", "rarity": "Common", "image_url": "images/fuel.png", "count": 550, "find_location": "모든 지역의 컨테이너", "recycling_yield": "화학 물질 x1" },
          { "id": 6, "name": "양자 칩", "rarity": "Epic", "image_url": "images/chip.png", "count": 98, "find_location": "테크니컬 구역, 연구 시설", "recycling_yield": "전자 부품 x3" },
          { "id": 7, "name": "수리 키트", "rarity": "Common", "image_url": "images/kit.png", "count": 75, "find_location": "생존자 캠프", "recycling_yield": "섬유 x2" },
          { "id": 8, "name": "플라즈마 코일", "rarity": "Legendary", "image_url": "images/coil.png", "count": 5, "find_location": "보스 드랍, 고위험 지역", "recycling_yield": "에너지 셀 x5" },
          { "id": 9, "name": "폐금속", "rarity": "Common", "image_url": "images/scrap.png", "count": 999, "find_location": "모든 지역의 파편", "recycling_yield": "금속 부품 x1" },
          { "id": 10, "name": "안정기", "rarity": "Rare", "image_url": "images/stab.png", "count": 45, "find_location": "정비소, 공업 시설", "recycling_yield": "기계 부품 x3" },
          { "id": 11, "name": "하이퍼 연료", "rarity": "Legendary", "image_url": "images/hfuel.png", "count": 2, "find_location": "고위험 지역의 비밀 상자", "recycling_yield": "화학 물질 x5" },
          { "id": 12, "name": "복합 섬유", "rarity": "Rare", "image_url": "images/fiber.png", "count": 300, "find_location": "폐허 지역", "recycling_yield": "섬유 x5" },
          { "id": 13, "name": "고밀도 자석", "rarity": "Epic", "image_url": "images/magnet.png", "count": 150, "find_location": "자기장 지대", "recycling_yield": "희귀 자성체 x3" },
          { "id": 14, "name": "정제된 오일", "rarity": "Common", "image_url": "images/oil.png", "count": 600, "find_location": "오일 펌프", "recycling_yield": "화학 물질 x2" },
          { "id": 15, "name": "미니 코어", "rarity": "Rare", "image_url": "images/core.png", "count": 80, "find_location": "파괴된 드론", "recycling_yield": "금속 부품 x3" },
          { "id": 16, "name": "레이저 부품", "rarity": "Epic", "image_url": "images/electronic.png", "count": 70, "find_location": "광학 시설", "recycling_yield": "전자 부품 x2" },
          { "id": 17, "name": "합금 조각", "rarity": "Common", "image_url": "images/scrap.png", "count": 800, "find_location": "모든 지역", "recycling_yield": "금속 부품 x1" },
          { "id": 18, "name": "특수 렌즈", "rarity": "Rare", "image_url": "images/optic.png", "count": 35, "find_location": "관측소", "recycling_yield": "유리 조각 x4" },
          { "id": 19, "name": "차폐 장치", "rarity": "Legendary", "image_url": "images/shield.png", "count": 8, "find_location": "봉쇄 구역 내부", "recycling_yield": "알 수 없음" },
          { "id": 20, "name": "에너지 셀", "rarity": "Epic", "image_url": "images/battery.png", "count": 120, "find_location": "발전소", "recycling_yield": "화학 물질 x3, 전자 부품 x1" },
          { "id": 21, "name": "파손된 툴킷", "rarity": "Common", "image_url": "images/kit.png", "count": 150, "find_location": "작업장", "recycling_yield": "금속 부품 x1" }
          ];
}

// 3. 아이템 HTML 요소 생성 함수 (script.js의 함수를 복사)
function createItemElement(item) {
    const row = document.createElement('a');
    row.classList.add('item-row');
    row.href = `detail.html?id=${item.id}`; 
    
    row.innerHTML = `
        <div class="item-info" data-rarity="${item.rarity}">
            <div class="item-image-container">
                <img src="${item.image_url}" alt="${item.name}" class="item-image">
            </div>
            <span class="item-name">${item.name}</span>
        </div>
        <span class="item-count">${item.count}</span>
    `;
    return row;
}

// 4. 페이지네이션 버튼 렌더링 함수
function renderPagination(totalItems, itemsPerPage, containerId, listRenderer) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById(containerId);
    paginationContainer.innerHTML = ''; 

    if (totalPages <= 1) return; 

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('pagination-button');
        button.textContent = i;
        
        if (i === currentPage) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            currentPage = i;
            listRenderer(allItems, i, itemsPerPage);
            
            document.querySelectorAll(`#${containerId} .pagination-button`).forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        paginationContainer.appendChild(button);
    }
}

// 5. 전체 아이템 목록 렌더링 함수 (페이지네이션 적용)
function displayFullList(items, page, itemsPerPage) {
    const fullListContainer = document.getElementById('full-item-list');
    fullListContainer.innerHTML = '';
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);

    if (pageItems.length === 0) {
        fullListContainer.innerHTML = '<p style="text-align: center; padding: 20px;">표시할 아이템이 없습니다.</p>';
    } else {
        pageItems.forEach(item => {
            fullListContainer.appendChild(createItemElement(item));
        });
    }
}

// 6. 검색/필터링 로직 (itemslist.html용)
function filterItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const fullListSection = document.getElementById('full-list-section');
    const resultsSection = document.getElementById('search-results');
    const resultsContainer = document.getElementById('results-list');
    const fixedTopBar = document.getElementById('fixed-top-bar');
    const mainContent = document.getElementById('main-content');
    const paginationContainer = document.getElementById('pagination-container');


    if (searchTerm.length > 0) {
        // 검색어가 있을 때 (검색 모드)
        fixedTopBar.style.position = 'static'; 
        fixedTopBar.style.borderBottom = 'none';
        mainContent.style.paddingTop = '20px'; 
        
        fullListSection.style.display = 'none'; // 전체 목록 섹션 숨김
        paginationContainer.style.display = 'none'; // 페이지네이션 숨김

        resultsSection.style.display = 'block'; 
        
        const filteredResults = allItems.filter(item => {
            return item.name.toLowerCase().includes(searchTerm);
        });
        
        resultsContainer.innerHTML = ''; 
        if (filteredResults.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">검색 결과가 없습니다.</p>';
        } else {
            // 검색 결과도 최대 30개만 표시 (선택 사항)
            filteredResults.slice(0, 30).forEach(item => { 
                resultsContainer.appendChild(createItemElement(item));
            });
        }
        
    } else {
        // 검색어가 없을 때 (전체 목록 모드)
        fixedTopBar.style.position = 'fixed';
        fixedTopBar.style.borderBottom = '1px solid #333';
        mainContent.style.paddingTop = '100px'; 
        
        fullListSection.style.display = 'block'; // 전체 목록 섹션 다시 표시
        paginationContainer.style.display = 'flex'; // 페이지네이션 다시 표시

        resultsSection.style.display = 'none'; 
    }
}


// 페이지 로드 시 시작
document.addEventListener('DOMContentLoaded', loadData);