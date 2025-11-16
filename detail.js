// URL에서 쿼리 매개변수를 가져오는 함수
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

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

// [복원/수정] 샘플 데이터 (detail.js 용 - used 필드 추가)
function getSampleData() {
    return [
      {
        "id": 1,
        "name": "녹슨 톱니 바퀴",
        "rarity": "Uncommon",
        "image_url": "images/items/rusted_gear.png", 
        "find_location": "공업 시설, 폐기물 처리장",
        "recycling_yield": [
          { "item_name": "스포터 릴레이", "item_image": "images/relay.png", "quantity": 1 },
          { "item_name": "금속 부품", "item_image": "images/metal.png", "quantity": 4 }
        ],
        "used": "작업장" // [추가] 사용처
      },
      {
        "id": 2,
        "name": "스포터 릴레이",
        "rarity": "Rare",
        "image_url": "images/relay.png",
        "find_location": "군사 기지, 아크 잔해",
        "recycling_yield": [
          { "item_name": "전자 부품", "item_image": "images/electronic.png", "quantity": 5 },
          { "item_name": "희귀 자성체", "item_image": "images/magnet.png", "quantity": 1 }
        ],
        "used": "프로젝트" // [추가]
      },
      {
        "id": 3,
        "name": "가시 배",
        "rarity": "Uncommon",
        "image_url": "images/pear.png",
        "find_location": "사막 지대, 황무지",
        "recycling_yield": [
          { "item_name": "섬유", "item_image": "images/fiber.png", "quantity": 3 }
        ],
        "used": "꼬꼬" // [추가]
      },
      {
        "id": 4,
        "name": "고대 핵",
        "rarity": "Legendary",
        "image_url": "images/core.png",
        "find_location": "아크 유적, 봉쇄 구역",
        "recycling_yield": [],
        "used": "판매 및 분해" // [추가]
      },
      {
        "id": 5,
        "name": "표준 연료",
        "rarity": "Common",
        "image_url": "images/fuel.png",
        "find_location": "모든 지역의 컨테이너",
        "recycling_yield": [
          { "item_name": "화학 물질", "item_image": "images/chem.png", "quantity": 1 }
        ],
        "used": "판매 및 분해" // [추가]
      }
    ];
}


// 아이템 ID로 데이터를 찾는 함수
async function findItemById(id) {
    try {
        const response = await fetch('./data.json');
        const data = await response.json(); 
        
        const item = data.find(i => i.id === parseInt(id));
        
        // [수정] data.json에서 찾지 못하면 샘플 데이터에서 찾도록 로직 변경
        if (item) {
            return item;
        } else {
            return getSampleData().find(i => i.id === parseInt(id));
        }

    } catch (error) {
        console.error("아이템 데이터 로드 실패. 샘플 데이터를 사용합니다.", error);
        return getSampleData().find(i => i.id === parseInt(id));
    }
}

// 상세 정보를 화면에 그리는 함수
function renderItemDetail(item) {
    const rarityLabel = document.getElementById('detail-item-rarity-label'); // 희귀도 태그
    const usedLabel = document.getElementById('detail-used-label');         // [추가] 사용처 태그

    // 1. 페이지 타이틀 업데이트
    document.getElementById('page-title').textContent = `${item.name} 상세 정보 - ARC Raiders DB`;
    
    // 2. 헤더 및 기본 정보 업데이트
    document.getElementById('detail-item-name-header').textContent = item.name;
    document.getElementById('detail-item-main-image').src = item.image_url;
    
    // 희귀도 표시
    rarityLabel.textContent = getKoreanRarityName(item.rarity);
    rarityLabel.setAttribute('data-rarity', item.rarity); 
    
    // [추가] 사용처 표시 (희귀도와 동일 스타일)
    if (item.used) {
        usedLabel.textContent = item.used;
        usedLabel.setAttribute('data-rarity', item.rarity); // 희귀도와 같은 색상 적용
        usedLabel.style.display = 'inline-block'; // 숨김 해제
    } else {
        usedLabel.style.display = 'none'; // 데이터 없으면 숨김
    }
    
    document.getElementById('detail-image-wrapper').setAttribute('data-rarity', item.rarity);
    
    // 3. 획득처 정보 업데이트
    document.getElementById('detail-find-location').textContent = item.find_location || '획득처 정보 없음';
    
    // 4. 재활용 목록 업데이트 (로직 유지)
    const recyclingList = document.getElementById('detail-recycling-list');
    recyclingList.innerHTML = '';
    
    let yields = item.recycling_yield;
    if (typeof yields === 'string') {
        recyclingList.innerHTML = `<p style="color: #ddd; font-style: italic;">${yields}</p>`;
    } else if (yields && yields.length > 0) {
        yields.forEach(yieldItem => {
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
        recyclingList.innerHTML = '<p style="color: #ddd; font-style: italic;">재활용 불가 또는 정보 없음</p>';
    }
}


// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async () => {
    const itemId = getQueryParam('id');
    if (itemId) {
        const item = await findItemById(itemId);
        if (item) {
            renderItemDetail(item);
        } else {
            document.getElementById('detail-item-name-header').textContent = '아이템을 찾을 수 없습니다.';
            document.getElementById('detail-image-wrapper').style.display = 'none';
            document.getElementById('item-meta-section').style.display = 'none';
        }
    } else {
        document.getElementById('detail-item-name-header').textContent = '잘못된 접근입니다.';
        document.getElementById('detail-image-wrapper').style.display = 'none';
        document.getElementById('item-meta-section').style.display = 'none';
    }
});