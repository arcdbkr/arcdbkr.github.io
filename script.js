let allItems = []; // 여기에 data.json 내용이 로드됩니다.

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

// 2. 샘플 데이터 (data.json 파일이 없거나 로드에 실패했을 경우를 위한 임시 데이터)
function getSampleData() {
    return [
    { "id": 1, "name": "녹슨 톱니 바퀴", "rarity": "Rare", "image_url": "images/gear.png", "find_location": "공업 시설, 폐기물 처리장", "recycling_yield": "금속 부품 x4, 기계 부품 x2" },
          { "id": 2, "name": "스포터 릴레이", "rarity": "Epic", "image_url": "images/relay.png", "find_location": "군사 기지, 아크 잔해", "recycling_yield": "전자 부품 x5, 희귀 자성체 x1" },
          { "id": 3, "name": "가시 배", "rarity": "Rare", "image_url": "images/pear.png", "find_location": "사막 지대, 황무지", "recycling_yield": "섬유 x3" },
          { "id": 4, "name": "고대 핵", "rarity": "Legendary", "image_url": "images/core.png", "find_location": "아크 유적, 봉쇄 구역", "recycling_yield": "알 수 없음" },
          { "id": 5, "name": "표준 연료", "rarity": "Common", "image_url": "images/fuel.png", "find_location": "모든 지역의 컨테이너", "recycling_yield": "화학 물질 x1" },
           { "id": 21, "name": "파손된 툴킷", "rarity": "Common", "image_url": "images/kit.png", "find_location": "작업장", "recycling_yield": "금속 부품 x1" }
          ];
}
// 3. 아이템 HTML 요소 생성 함수 (수정됨)
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
        `;
    return row;
}

// 4. 최근 아이템 표시 (모바일 10개, PC 최대 30개 표시를 위해 최대 30개 로드)
function displayRecentItems() {
    const recentListContainer = document.getElementById('recent-list');
    
    // PC에서 보여줄 최대 개수(30개)만큼 로드
    const recentItems = allItems.slice(0, 30); 
    
    recentListContainer.innerHTML = ''; 
    if (recentItems.length === 0) {
        recentListContainer.innerHTML = '<p style="text-align: center; padding: 20px;">표시할 아이템이 없습니다.</p>';
    } else {
        recentItems.forEach((item, index) => {
            const itemElement = createItemElement(item);
            // [수정]: 모바일에서 숨길 클래스 추가 (인덱스 10번 이후, 즉 11번째 아이템부터)
            if (index >= 10) {
                itemElement.classList.add('hidden-mobile-item');
            }
            recentListContainer.appendChild(itemElement);
        });
    }
}

// 5. 검색/필터링 로직
function filterItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const recentSection = document.getElementById('recent-items');
    const resultsSection = document.getElementById('search-results');
    const resultsContainer = document.getElementById('results-list');
    const fixedTopBar = document.getElementById('fixed-top-bar');
    const mainContent = document.getElementById('main-content');
    
    // [추가] 소개 카드 요소를 가져옵니다.
    const introCard = document.getElementById('intro-card'); 

    if (searchTerm.length > 0) {
        // 검색어가 있을 때 (검색 모드)
        fixedTopBar.style.position = 'static'; 
        fixedTopBar.style.borderBottom = 'none';
        mainContent.style.paddingTop = '20px'; 
        
        // [수정] 소개 카드 숨기기
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

        // [수정] 소개 카드 다시 표시
        introCard.style.display = 'block'; // 'block' 또는 'flex' (CSS에 따름)
        
        recentSection.style.display = 'block'; 
        resultsSection.style.display = 'none'; 
    }
}
// 6. 카테고리 및 버튼 이벤트 리스너 (수정됨)
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
    
    // [핵심 수정] .browse-button 클릭 시 itemslist.html로 이동
    const browseButton = document.querySelector('.browse-button');
    if (browseButton) {
        browseButton.addEventListener('click', () => {
            window.location.href = 'itemslist.html';
        });
    }
});