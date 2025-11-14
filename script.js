let allItems = []; 
const ITEMS_PER_PAGE = 20; 
let currentPage = 1;       

// [수정] 5단계 레어도 영문 키를 한글 이름으로 변환하는 맵
const rarityNameMap = {
    'Common': '일반',
    'Uncommon': '고급',
    'Rare': '희귀',
    'Epic': '에픽',
    'Legendary': '전설'
};

function getKoreanRarityName(englishRarity) {
    return rarityNameMap[englishRarity] || englishRarity;
}

// 1. JSON 데이터 로드
async function loadData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json(); 
        allItems = data.length > 0 ? data : getSampleData();
        
        console.log("데이터 로드 완료:", allItems.length, "개 아이템");
        
        displayRecentItems();
    } catch (error) {
        console.error("아이템 데이터 로드 실패. 샘플 데이터를 사용합니다.", error);
        allItems = getSampleData();
        displayRecentItems();
    }
}

// 2. 샘플 데이터 (5단계 레어도 및 COUNT 제거됨)
function getSampleData() {
    return [
    { "id": 1, "name": "녹슨 톱니 바퀴", "rarity": "Uncommon", "image_url": "images/items/1.png", "find_location": "공업 시설, 폐기물 처리장", "recycling_yield": "금속 부품 x4, 기계 부품 x2" },
          { "id": 2, "name": "스포터 릴레이", "rarity": "Rare", "image_url": "images/relay.png", "find_location": "군사 기지, 아크 잔해", "recycling_yield": "전자 부품 x5, 희귀 자성체 x1" },
          { "id": 3, "name": "가시 배", "rarity": "Uncommon", "image_url": "images/pear.png", "find_location": "사막 지대, 황무지", "recycling_yield": "섬유 x3" },
          { "id": 4, "name": "고대 핵", "rarity": "Legendary", "image_url": "images/core.png", "find_location": "아크 유적, 봉쇄 구역", "recycling_yield": "알 수 없음" },
          { "id": 5, "name": "표준 연료", "rarity": "Common", "image_url": "images/fuel.png", "find_location": "모든 지역의 컨테이너", "recycling_yield": "화학 물질 x1" },
          { "id": 6, "name": "양자 칩", "rarity": "Epic", "image_url": "images/chip.png", "find_location": "테크니컬 구역, 연구 시설", "recycling_yield": "전자 부품 x3" },
          { "id": 7, "name": "수리 키트", "rarity": "Common", "image_url": "images/kit.png", "find_location": "생존자 캠프", "recycling_yield": "섬유 x2" },
          { "id": 8, "name": "플라즈마 코일", "rarity": "Legendary", "image_url": "images/coil.png", "find_location": "보스 드랍, 고위험 지역", "recycling_yield": "에너지 셀 x5" },
          { "id": 9, "name": "폐금속", "rarity": "Common", "image_url": "images/scrap.png", "find_location": "모든 지역의 파편", "recycling_yield": "금속 부품 x1" },
          { "id": 10, "name": "안정기", "rarity": "Uncommon", "image_url": "images/stab.png", "find_location": "정비소, 공업 시설", "recycling_yield": "기계 부품 x3" },
          { "id": 11, "name": "하이퍼 연료", "rarity": "Legendary", "image_url": "images/hfuel.png", "find_location": "고위험 지역의 비밀 상자", "recycling_yield": "화학 물질 x5" },
          { "id": 12, "name": "복합 섬유", "rarity": "Uncommon", "image_url": "images/fiber.png", "find_location": "폐허 지역", "recycling_yield": "섬유 x5" },
          { "id": 13, "name": "고밀도 자석", "rarity": "Rare", "image_url": "images/magnet.png", "find_location": "자기장 지대", "recycling_yield": "희귀 자성체 x3" },
          { "id": 14, "name": "정제된 오일", "rarity": "Common", "image_url": "images/oil.png", "find_location": "오일 펌프", "recycling_yield": "화학 물질 x2" },
          { "id": 15, "name": "미니 코어", "rarity": "Uncommon", "image_url": "images/core.png", "find_location": "파괴된 드론", "recycling_yield": "금속 부품 x3" },
          { "id": 16, "name": "레이저 부품", "rarity": "Epic", "image_url": "images/electronic.png", "find_location": "광학 시설", "recycling_yield": "전자 부품 x2" },
          { "id": 17, "name": "합금 조각", "rarity": "Common", "image_url": "images/scrap.png", "find_location": "모든 지역", "recycling_yield": "금속 부품 x1" },
          { "id": 18, "name": "특수 렌즈", "rarity": "Uncommon", "image_url": "images/optic.png", "find_location": "관측소", "recycling_yield": "유리 조각 x4" },
          { "id": 19, "name": "차폐 장치", "rarity": "Legendary", "image_url": "images/shield.png", "find_location": "봉쇄 구역 내부", "recycling_yield": "알 수 없음" },
          { "id": 20, "name": "에너지 셀", "rarity": "Rare", "image_url": "images/battery.png", "find_location": "발전소", "recycling_yield": "화학 물질 x3, 전자 부품 x1" },
          { "id": 21, "name": "파손된 툴킷", "rarity": "Common", "image_url": "images/kit.png", "find_location": "작업장", "recycling_yield": "금속 부품 x1" }
          ];
}


// script.js 및 itemslist.js 파일 내 createItemElement 함수
function createItemElement(item) {
    const row = document.createElement('a');
    row.classList.add('item-row');
    row.href = `detail.html?id=${item.id}`; 
    
    // [필수] item-row (폰트 색상 상속용)
    row.setAttribute('data-rarity', item.rarity); 

    row.innerHTML = `
        <div class="item-info" data-rarity="${item.rarity}">
            <div class="item-image-container">
                <img src="${item.image_url}" alt="${item.name}" class="item-image">
            </div>
            <span class="item-name">${item.name}</span>
        </div>
        `;
    return row;
}
// 4. 최근 아이템 표시 (유지)
function displayRecentItems() {
    const recentListContainer = document.getElementById('recent-list');
    
    const recentItems = allItems.slice(0, 30); 
    
    recentListContainer.innerHTML = ''; 
    if (recentItems.length === 0) {
        recentListContainer.innerHTML = '<p style="text-align: center; padding: 20px;">표시할 아이템이 없습니다.</p>';
    } else {
        recentItems.forEach((item, index) => {
            const itemElement = createItemElement(item);
            if (index >= 10) {
                itemElement.classList.add('hidden-mobile-item');
            }
            recentListContainer.appendChild(itemElement);
        });
    }
}


// 5. 검색/필터링 로직 (상단 고정 바 제어 및 검색 기능)
function filterItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const recentSection = document.getElementById('recent-items');
    const resultsSection = document.getElementById('search-results');
    const resultsContainer = document.getElementById('results-list');
    const fixedTopBar = document.getElementById('fixed-top-bar');
    const mainContent = document.getElementById('main-content');
    const introCard = document.getElementById('intro-card'); 

    if (searchTerm.length > 0) {
        // 검색어가 있을 때 (검색 모드)
        fixedTopBar.style.position = 'static'; 
        fixedTopBar.style.borderBottom = 'none';
        mainContent.style.paddingTop = '20px'; 
        
        introCard.style.display = 'none'; 

        recentSection.style.display = 'none'; 
        resultsSection.style.display = 'block'; 
        
        const filteredResults = allItems.filter(item => {
            return item.name.toLowerCase().includes(searchTerm);
        });
        
        resultsContainer.innerHTML = ''; 
        if (filteredResults.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">검색 결과가 없습니다.</p>';
        } else {
            filteredResults.slice(0, 30).forEach(item => { 
                resultsContainer.appendChild(createItemElement(item));
            });
        }
        
    } else {
        // 검색어가 없을 때 (기본 모드)
        fixedTopBar.style.position = 'fixed';
        fixedTopBar.style.borderBottom = '1px solid #333';
        mainContent.style.paddingTop = '100px'; 

        introCard.style.display = 'block'; 
        
        recentSection.style.display = 'block'; 
        resultsSection.style.display = 'none'; 
    }
}


// 6. 카테고리 및 버튼 이벤트 리스너 (아이템 목록 버튼 클릭 로직)
document.addEventListener('DOMContentLoaded', () => {
    loadData(); 
    
    const navItems = document.querySelectorAll('#category-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            console.log("카테고리 선택됨:", filterType); 
        });
    });
    
    // browse-button 클릭 시 itemslist.html로 이동
    const browseButton = document.querySelector('.browse-button');
    if (browseButton) {
        browseButton.addEventListener('click', () => {
            window.location.href = 'itemslist.html';
        });
    }
});