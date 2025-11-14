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
          { "id": 11, "name": "하이퍼 연료", "rarity": "Legendary", "image_url": "images/hfuel.png", "count": 2, "find_location": "고위험 지역의 비밀 상자", "recycling_yield": "화학 물질 x5" }
          ];
}


// 3. 아이템 HTML 요소 생성 함수
function createItemElement(item) {
    // [수정] <a> 태그를 사용하여 클릭 시 상세 페이지로 이동하도록 변경
    const row = document.createElement('a');
    row.classList.add('item-row');
    
    // 상세 페이지 링크 설정
    row.href = `detail.html?id=${item.id}`; 
    
    // 등급 컬러 적용을 위한 데이터 속성 사용
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