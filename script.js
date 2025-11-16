let allItems = []; 
const ITEMS_PER_PAGE = 20; 
let currentPage = 1;       

// [유지] 5단계 레어도 영문 키를 한글 이름으로 변환하는 맵
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

// 1. JSON 데이터 로드 (로직 유지)
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

// 2. 샘플 데이터 (used 필드 포함 및 5단계 레어도)
function getSampleData() {
    return [
    { "id": 1, "name": "녹슨 톱니 바퀴", "rarity": "Uncommon", "image_url": "images/items/1.png", "count": 216, "find_location": "공업 시설, 폐기물 처리장", "recycling_yield": "금속 부품 x4, 기계 부품 x2", "used": "작업장" },
    { "id": 2, "name": "스포터 릴레이", "rarity": "Rare", "image_url": "images/relay.png", "count": 203, "find_location": "군사 기지, 아크 잔해", "recycling_yield": "전자 부품 x5, 희귀 자성체 x1", "used": "프로젝트" },
    { "id": 3, "name": "가시 배", "rarity": "Uncommon", "image_url": "images/pear.png", "count": 180, "find_location": "사막 지대, 황무지", "recycling_yield": "섬유 x2", "used": "꼬꼬" },
    { "id": 4, "name": "잡다한 씨앗", "rarity": "Common", "image_url": "images/seeds.png", "count": 500, "find_location": "자연, 꼬꼬", "recycling_yield": "재활용 불가", "used": "판매 및 분해" },
    { "id": 5, "name": "고양이 침대", "rarity": "Uncommon", "image_url": "images/cat_bed.png", "count": 150, "find_location": "주거, 상업", "recycling_yield": "섬유 x10", "used": "판매 및 분해" },
    { "id": 6, "name": "커피 포트", "rarity": "Common", "image_url": "images/coffee_pot.png", "count": 400, "find_location": "주거", "recycling_yield": "금속 부품 x3", "used": "작업장" }
    ];
}

// 3. 아이템 HTML 요소 생성 함수 (data-rarity 속성 설정 필수)
function createItemElement(item) {
    const row = document.createElement('a');
    row.classList.add('item-row');
    
    row.href = `detail.html?id=${item.id}`; 
    
    // [⭐ 필수 유지] item-row (테두리/폰트색용)
    row.setAttribute('data-rarity', item.rarity); 

    row.innerHTML = `
        <div class="item-info" data-rarity="${item.rarity}">  <div class="item-image-container">  <img src="${item.image_url}" alt="${item.name}" class="item-image">
            </div>
            <span class="item-name">${item.name}</span>
            ${item.used ? `<span class="item-used-subtitle">${item.used}</span>` : ''}
        </div>
    `;
    return row;
}

// 4. 최근 아이템 표시 (역순 정렬 적용)
function displayRecentItems() {
    const recentListContainer = document.getElementById('recent-list');
    
    const reversedItems = [...allItems].reverse(); 
    const recentItems = reversedItems.slice(0, 30); 
    
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


// 5. 검색/필터링 로직 (로직 유지)
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


// 6. 카테고리 및 버튼 이벤트 리스너 (로직 유지)
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

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }
});