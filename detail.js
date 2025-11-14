// URL에서 쿼리 매개변수를 가져오는 함수
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// [복원] 샘플 데이터 (detail.js 용 - stats 제거 및 recycling_yield 구조 변경)
function getSampleData() {
    return [
      {
        "id": 1,
        "name": "녹슨 톱니 바퀴",
        "rarity": "Rare",
        "image_url": "images/items/rusted_gear.png", 
        "count": 216,
        "find_location": "공업 시설, 폐기물 처리장",
        "recycling_yield": [
          { "item_name": "스포터 릴레이", "item_image": "images/relay.png", "quantity": 1 },
          { "item_name": "금속 부품", "item_image": "images/metal.png", "quantity": 4 }
        ]
      },
      {
        "id": 2,
        "name": "스포터 릴레이",
        "rarity": "Epic",
        "image_url": "images/relay.png",
        "count": 203,
        "find_location": "군사 기지, 아크 잔해",
        "recycling_yield": [
          { "item_name": "전자 부품", "item_image": "images/electronic.png", "quantity": 5 },
          { "item_name": "희귀 자성체", "item_image": "images/magnet.png", "quantity": 1 }
        ]
      },
      {
        "id": 3,
        "name": "가시 배",
        "rarity": "Rare", 
        "image_url": "images/pear.png",
        "count": 187,
        "find_location": "사막 지대, 황무지",
        "recycling_yield": [
          { "item_name": "섬유", "item_image": "images/fiber.png", "quantity": 3 }
        ]
      },
      {
        "id": 4,
        "name": "고대 핵",
        "rarity": "Legendary",
        "image_url": "images/core.png",
        "count": 12,
        "find_location": "아크 유적, 봉쇄 구역",
        "recycling_yield": []
      },
      {
        "id": 5,
        "name": "표준 연료",
        "rarity": "Common",
        "image_url": "images/fuel.png",
        "count": 550,
        "find_location": "모든 지역의 컨테이너",
        "recycling_yield": [
          { "item_name": "화학 물질", "item_image": "images/chem.png", "quantity": 1 }
        ]
      }
    ];
}


// 데이터 로드 및 렌더링 시작 함수
async function loadData() {
    let allItems = [];
    
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allItems = await response.json(); 
        
    } catch (error) {
        console.error("데이터 로드 실패. 내부 샘플 데이터를 사용합니다:", error);
        // [복원] 데이터 로드 실패 시, 내부 샘플 데이터 사용
        allItems = getSampleData();
    }
    
    // 이후 아이템 찾기 및 렌더링 로직은 유지
    const itemId = getQueryParam('id');
    
    if (!itemId) {
        document.getElementById('item-detail-card').innerHTML = '<h2>오류: 아이템 ID가 지정되지 않았습니다.</h2>';
        return;
    }
    
    const item = allItems.find(i => i.id === parseInt(itemId));

    if (item) {
        renderItemDetail(item);
    } else {
        document.getElementById('item-detail-card').innerHTML = `<h2>오류: ID ${itemId} 아이템을 찾을 수 없습니다.</h2>`;
    }
}

// 상세 정보를 화면에 그리는 함수
function renderItemDetail(item) {
    // 1. 페이지 타이틀 업데이트
    document.getElementById('page-title').textContent = `${item.name} 상세 정보 - ARC Raiders DB`;
    
    // 2. 헤더 및 기본 정보 업데이트
    document.getElementById('detail-item-count').textContent = item.count;
    
    // [수정] COUNT 레이블에도 data-rarity를 설정
    const countLabel = document.getElementById('detail-item-count-label');
    countLabel.setAttribute('data-rarity', item.rarity); 
    
    document.getElementById('detail-item-rarity-label').textContent = item.rarity.toUpperCase();
    document.getElementById('detail-item-rarity-label').setAttribute('data-rarity', item.rarity); 
    document.getElementById('detail-item-name-header').textContent = item.name;
    document.getElementById('detail-item-main-image').src = item.image_url;
    
    // 이미지 섹션에 등급별 코너 색상 적용을 위해 data-rarity 속성을 추가합니다.
    document.getElementById('detail-image-wrapper').setAttribute('data-rarity', item.rarity);
    
    // 3. 획득처 정보 업데이트
    document.getElementById('detail-find-location').textContent = item.find_location || '획득처 정보 없음';
    
    // 4. 재활용 목록 업데이트 (로직 유지)
    const recyclingList = document.getElementById('detail-recycling-list');
    recyclingList.innerHTML = '';
    
    if (item.recycling_yield && item.recycling_yield.length > 0) {
        item.recycling_yield.forEach(yieldItem => {
            const yieldElement = document.createElement('div');
            yieldElement.classList.add('recycling-item-row');
            yieldElement.innerHTML = `
                <div class="item-info">
                    <div class="item-image-container">
                        <img src="${yieldItem.item_image}" alt="${yieldItem.item_name}" class="item-image">
                    </div>
                    <span class="item-name">${yieldItem.item_name}</span>
                </div>
                <span class="item-count">${yieldItem.quantity}</span>
            `;
            recyclingList.appendChild(yieldElement);
        });
    } else {
        recyclingList.innerHTML = '<p class="no-data">재활용 보상이 없습니다.</p>';
    }
}


// 페이지 로드 시 시작
document.addEventListener('DOMContentLoaded', loadData);