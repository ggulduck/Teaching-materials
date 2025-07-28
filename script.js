// 전역 변수
let currentSubject = '';
let currentSemester = '';
let currentTopic = '';
let currentMaterials = [];
let editingMaterialId = null;
let currentSortType = getSortTypeFromStorage(); // localStorage에서 정렬 타입 불러오기
let isFavoriteFilterActive = getFavoriteFilterFromStorage(); // 즐겨찾기 필터 상태
let currentSearchTerm = ''; // 현재 검색어

// DOM 요소들
const subjectTabs = document.querySelectorAll('.tab-btn');
const semesterButtons = document.getElementById('semesterButtons');
const semesterBtns = document.querySelectorAll('.semester-btn');
const topicButtons = document.getElementById('topicButtons');
const firstSemesterTopics = document.getElementById('firstSemesterTopics');
const secondSemesterTopics = document.getElementById('secondSemesterTopics');
const topicBtns = document.querySelectorAll('.topic-btn');
const materialsSection = document.getElementById('materialsSection');
const welcomeMessage = document.getElementById('welcomeMessage');
const materialsList = document.getElementById('materialsList');
const currentPath = document.getElementById('currentPath');
const addMaterialBtn = document.getElementById('addMaterialBtn');
const sortOptions = document.getElementById('sortOptions');
const sortBtns = document.querySelectorAll('.sort-btn');
const favoriteFilterBtn = document.getElementById('favoriteFilterBtn');

// 검색 관련 요소들
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');

// 모달 관련 요소들
const materialModal = document.getElementById('materialModal');
const detailModal = document.getElementById('detailModal');
const closeModal = document.getElementById('closeModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const cancelBtn = document.getElementById('cancelBtn');
const materialForm = document.getElementById('materialForm');
const modalTitle = document.getElementById('modalTitle');
const materialTitle = document.getElementById('materialTitle');
const materialDescription = document.getElementById('materialDescription');
const materialLink = document.getElementById('materialLink');
const materialFile = document.getElementById('materialFile');
const fileInfo = document.getElementById('fileInfo');

// 상세 보기 모달 요소들
const detailTitle = document.getElementById('detailTitle');
const detailContent = document.getElementById('detailContent');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');

// 메모 모달 관련 요소들
const memoModal = document.getElementById('memoModal');
const closeMemoModal = document.getElementById('closeMemoModal');
const cancelMemoBtn = document.getElementById('cancelMemoBtn');
const memoForm = document.getElementById('memoForm');
const memoTitle = document.getElementById('memoTitle');
const memoContent = document.getElementById('memoContent');

// 날짜 표시 관련 요소들
const dateDisplay = document.getElementById('dateDisplay');

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadMaterialsFromStorage();
    updateSortButtonStates(); // 정렬 버튼 상태 업데이트
    updateFavoriteFilterState(); // 즐겨찾기 필터 상태 업데이트
    setSeasonalBackground(); // 계절별 배경 설정
    displayCurrentDate(); // 현재 날짜 표시
});

function initializeEventListeners() {
    // 교과 탭 클릭 이벤트
    subjectTabs.forEach(tab => {
        tab.addEventListener('click', () => handleSubjectClick(tab));
    });

    // 학기 버튼 클릭 이벤트
    semesterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleSemesterClick(btn));
    });

    // 주제 버튼 클릭 이벤트
    topicBtns.forEach(btn => {
        btn.addEventListener('click', () => handleTopicClick(btn));
    });

    // 정렬 버튼 이벤트
    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => handleSortClick(btn));
    });

    // 즐겨찾기 필터 버튼 이벤트
    favoriteFilterBtn.addEventListener('click', handleFavoriteFilterClick);

    // 검색 관련 이벤트
    searchInput.addEventListener('input', handleSearchInput);
    searchClearBtn.addEventListener('click', clearSearch);

    // 모달 관련 이벤트
    closeModal.addEventListener('click', closeMaterialModal);
    closeDetailModal.addEventListener('click', closeDetailModalFunc);
    cancelBtn.addEventListener('click', closeMaterialModal);
    addMaterialBtn.addEventListener('click', openAddMaterialModal);
    materialForm.addEventListener('submit', handleMaterialSubmit);

    // 메모 모달 이벤트
    closeMemoModal.addEventListener('click', closeMemoModalFunc);
    cancelMemoBtn.addEventListener('click', closeMemoModalFunc);
    memoForm.addEventListener('submit', handleMemoSubmit);

    // 파일 업로드 이벤트
    materialFile.addEventListener('change', handleFileChange);

    // 상세 보기 모달 이벤트
    editBtn.addEventListener('click', handleEditMaterial);
    deleteBtn.addEventListener('click', handleDeleteMaterial);

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === materialModal) closeMaterialModal();
        if (e.target === detailModal) closeDetailModalFunc();
        if (e.target === memoModal) closeMemoModalFunc();
    });
}

// 교과 탭 클릭 처리
function handleSubjectClick(clickedTab) {
    // 활성 탭 변경
    subjectTabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
    
    currentSubject = clickedTab.dataset.subject;
    currentSemester = '';
    currentTopic = '';
    
    // 학기 버튼 표시
    semesterButtons.style.display = 'flex';
    topicButtons.style.display = 'none';
    
    // 자료 섹션 숨기고 환영 메시지 표시
    materialsSection.style.display = 'none';
    welcomeMessage.style.display = 'block';
    
    // 통합교과가 아닌 경우 바로 자료 표시
    if (currentSubject !== '통합교과') {
        loadMaterials();
    }
}

// 학기 버튼 클릭 처리
function handleSemesterClick(clickedBtn) {
    // 활성 학기 버튼 변경
    semesterBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    currentSemester = clickedBtn.dataset.semester;
    currentTopic = '';
    
    // 통합교과인 경우 주제 버튼 표시
    if (currentSubject === '통합교과') {
        topicButtons.style.display = 'block';
        if (currentSemester === '1학기') {
            firstSemesterTopics.style.display = 'flex';
            secondSemesterTopics.style.display = 'none';
        } else {
            firstSemesterTopics.style.display = 'none';
            secondSemesterTopics.style.display = 'flex';
        }
    } else {
        // 다른 교과는 바로 자료 표시
        loadMaterials();
    }
}

// 주제 버튼 클릭 처리
function handleTopicClick(clickedBtn) {
    // 활성 주제 버튼 변경
    topicBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    currentTopic = clickedBtn.dataset.topic;
    loadMaterials();
}

// 자료 로드 및 표시
function loadMaterials() {
    const path = getCurrentPath();
    currentPath.textContent = path;
    
    // 검색어가 있는 경우 전체 자료에서 검색
    if (currentSearchTerm.trim()) {
        const searchTerm = currentSearchTerm.toLowerCase();
        currentMaterials = getAllMaterials().filter(material => 
            material.title.toLowerCase().includes(searchTerm) ||
            material.description.toLowerCase().includes(searchTerm)
        );
        
        // 즐겨찾기 필터만 적용 (교과/학기/주제 필터는 적용하지 않음)
        if (isFavoriteFilterActive) {
            currentMaterials = currentMaterials.filter(material => material.isFavorite);
        }
    } else {
        // 검색어가 없는 경우 현재 선택된 경로에 해당하는 자료 필터링
        let filteredMaterials = getAllMaterials().filter(material => {
            if (currentSubject === '통합교과') {
                return material.subject === currentSubject && 
                       material.semester === currentSemester && 
                       material.topic === currentTopic;
            } else {
                return material.subject === currentSubject && 
                       material.semester === currentSemester;
            }
        });
        
        // 즐겨찾기 필터 적용
        if (isFavoriteFilterActive) {
            filteredMaterials = filteredMaterials.filter(material => material.isFavorite);
        }
        
        currentMaterials = filteredMaterials;
    }
    
    // 자료 섹션 표시
    materialsSection.style.display = 'block';
    welcomeMessage.style.display = 'none';
    
    // 자료 목록 렌더링 (정렬 적용)
    renderMaterials();
}

// 현재 경로 문자열 생성
function getCurrentPath() {
    if (currentSearchTerm.trim()) {
        return `검색 결과: "${currentSearchTerm}" (${currentMaterials.length}개 자료)`;
    } else if (currentSubject === '통합교과') {
        return `${currentSubject} > ${currentSemester} > ${currentTopic}`;
    } else {
        return `${currentSubject} > ${currentSemester}`;
    }
}

// 정렬 버튼 클릭 처리
function handleSortClick(clickedBtn) {
    // 활성 버튼 변경
    sortBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    // 정렬 타입 업데이트
    currentSortType = clickedBtn.dataset.sort;
    
    // localStorage에 정렬 타입 저장
    saveSortTypeToStorage(currentSortType);
    
    // 자료 목록 다시 렌더링
    renderMaterials();
}

// 자료 정렬 함수
function sortMaterials(materials) {
    const sortedMaterials = [...materials];
    
    switch (currentSortType) {
        case 'title-asc': // 제목 가나다순 (ㄱ~ㅎ)
            return sortedMaterials.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        case 'title-desc': // 제목 역순 (ㅎ~ㄱ)
            return sortedMaterials.sort((a, b) => b.title.localeCompare(a.title, 'ko'));
        case 'date-desc': // 최신순 (업로드일 내림차순)
            return sortedMaterials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'date-asc': // 오래된 순 (업로드일 오름차순)
            return sortedMaterials.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        default:
            return sortedMaterials;
    }
}

// 자료 목록 렌더링
function renderMaterials() {
    if (currentMaterials.length === 0) {
        materialsList.innerHTML = `
            <div class="empty-state">
                <p>아직 등록된 자료가 없습니다.</p>
                <p>새 자료를 추가해보세요!</p>
            </div>
        `;
        return;
    }
    
    // 현재 선택된 교과/학기/주제 내의 자료만 정렬 적용
    const sortedMaterials = sortMaterials(currentMaterials);
    
    materialsList.innerHTML = sortedMaterials.map(material => `
        <div class="material-card" data-id="${material.id}">
            <button class="favorite-btn ${material.isFavorite ? 'favorited' : ''}" onclick="toggleFavorite('${material.id}', event)">
                ★
            </button>
            <button class="memo-btn ${material.memo ? 'has-memo' : ''}" onclick="openMemoModal('${material.id}', event)" title="${material.memo ? '메모 수정' : '메모 작성'}">
                📝
            </button>
            <div class="material-title">${material.title}</div>
            <div class="material-description">${material.description}</div>
            <div class="material-links">
                ${material.link ? `<div class="preview-container">
                    <a href="${material.link}" target="_blank" class="material-link" onmouseenter="showPreview('${material.id}', 'link', '${material.link}')" onmouseleave="hidePreview('${material.id}')">🔗 링크</a>
                    <div class="preview-popup" id="preview-${material.id}-link"></div>
                </div>` : ''}
                ${material.fileName ? `<div class="preview-container">
                    <span class="material-file" onclick="downloadFile('${material.id}')" onmouseenter="showPreview('${material.id}', 'file', '${material.fileName}')" onmouseleave="hidePreview('${material.id}')">📎 ${material.fileName}</span>
                    <div class="preview-popup" id="preview-${material.id}-file"></div>
                </div>` : ''}
            </div>
            ${material.memo ? `
                <div class="material-memo">
                    <div class="memo-header">
                        <div class="memo-label">📝 수업 후기 / 메모</div>
                        <div class="memo-actions">
                            <button class="memo-edit-btn" onclick="openMemoModal('${material.id}', event)">수정</button>
                            <button class="memo-delete-btn" onclick="deleteMemo('${material.id}', event)">삭제</button>
                        </div>
                    </div>
                    <div class="memo-content">${material.memo}</div>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    // 자료 카드 클릭 이벤트 추가 (즐겨찾기, 메모 버튼 제외)
    document.querySelectorAll('.material-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('favorite-btn') && !e.target.classList.contains('memo-btn') && 
                !e.target.classList.contains('memo-edit-btn') && !e.target.classList.contains('memo-delete-btn')) {
                showMaterialDetail(card.dataset.id);
            }
        });
    });
}

// 자료 상세 보기
function showMaterialDetail(materialId) {
    const material = currentMaterials.find(m => m.id === materialId);
    if (!material) return;
    
    detailTitle.textContent = material.title;
    detailContent.innerHTML = `
        <h4>제목</h4>
        <p>${material.title}</p>
        <h4>설명</h4>
        <p>${material.description}</p>
        ${material.link ? `
            <h4>자료 링크</h4>
            <p><a href="${material.link}" target="_blank">${material.link}</a></p>
        ` : ''}
        ${material.fileName ? `
            <h4>첨부파일</h4>
            <p><span onclick="downloadFile('${material.id}')" style="cursor: pointer; color: #6c5ce7;">📎 ${material.fileName}</span></p>
        ` : ''}
    `;
    
    // 수정/삭제 버튼에 materialId 저장
    editBtn.dataset.materialId = materialId;
    deleteBtn.dataset.materialId = materialId;
    
    detailModal.style.display = 'block';
}

// 자료 추가 모달 열기
function openAddMaterialModal() {
    editingMaterialId = null;
    modalTitle.textContent = '새 자료 추가';
    materialForm.reset();
    fileInfo.textContent = '';
    materialModal.style.display = 'block';
}

// 자료 수정 모달 열기
function handleEditMaterial() {
    const materialId = editBtn.dataset.materialId;
    const material = currentMaterials.find(m => m.id === materialId);
    if (!material) return;
    
    editingMaterialId = materialId;
    modalTitle.textContent = '자료 수정';
    
    // 폼에 기존 데이터 채우기
    materialTitle.value = material.title;
    materialDescription.value = material.description;
    materialLink.value = material.link || '';
    fileInfo.textContent = material.fileName || '';
    
    closeDetailModalFunc();
    materialModal.style.display = 'block';
}

// 자료 삭제 처리
function handleDeleteMaterial() {
    const materialId = deleteBtn.dataset.materialId;
    if (confirm('정말로 이 자료를 삭제하시겠습니까?')) {
        deleteMaterial(materialId);
        closeDetailModalFunc();
        loadMaterials();
    }
}

// 자료 삭제
function deleteMaterial(materialId) {
    let allMaterials = getAllMaterials();
    allMaterials = allMaterials.filter(m => m.id !== materialId);
    localStorage.setItem('materials', JSON.stringify(allMaterials));
}

// 자료 제출 처리
async function handleMaterialSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: materialTitle.value.trim(),
        description: materialDescription.value.trim(),
        link: materialLink.value.trim() || null,
        subject: currentSubject,
        semester: currentSemester,
        topic: currentTopic,
        fileName: fileInfo.textContent || null,
        fileData: materialFile.files[0] ? await fileToBase64(materialFile.files[0]) : null
    };
    
    if (editingMaterialId) {
        // 수정
        updateMaterial(editingMaterialId, formData);
    } else {
        // 새로 추가
        addMaterial(formData);
    }
    
    closeMaterialModal();
    loadMaterials();
}

// 파일을 Base64로 변환
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// 자료 추가
function addMaterial(materialData) {
    const newMaterial = {
        id: generateId(),
        ...materialData,
        createdAt: new Date().toISOString()
    };
    
    let allMaterials = getAllMaterials();
    allMaterials.push(newMaterial);
    localStorage.setItem('materials', JSON.stringify(allMaterials));
}

// 자료 수정
function updateMaterial(materialId, materialData) {
    let allMaterials = getAllMaterials();
    const index = allMaterials.findIndex(m => m.id === materialId);
    
    if (index !== -1) {
        allMaterials[index] = {
            ...allMaterials[index],
            ...materialData,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem('materials', JSON.stringify(allMaterials));
    }
}

// 파일 다운로드
function downloadFile(materialId) {
    const material = getAllMaterials().find(m => m.id === materialId);
    if (!material || !material.fileData) return;
    
    const link = document.createElement('a');
    link.href = material.fileData;
    link.download = material.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 파일 변경 처리
function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        fileInfo.textContent = file.name;
    } else {
        fileInfo.textContent = '';
    }
}

// 모달 닫기 함수들
function closeMaterialModal() {
    materialModal.style.display = 'none';
    materialForm.reset();
    fileInfo.textContent = '';
}

function closeDetailModalFunc() {
    detailModal.style.display = 'none';
}

// localStorage 관련 함수들
function getAllMaterials() {
    const materials = localStorage.getItem('materials');
    return materials ? JSON.parse(materials) : [];
}

function loadMaterialsFromStorage() {
    // 페이지 로드 시 저장된 자료 불러오기
    getAllMaterials();
}

// 정렬 타입 localStorage 관련 함수들
function saveSortTypeToStorage(sortType) {
    localStorage.setItem('currentSortType', sortType);
}

function getSortTypeFromStorage() {
    const sortType = localStorage.getItem('currentSortType');
    return sortType || 'title-asc'; // 기본값: 제목 가나다순
}

// 즐겨찾기 필터 localStorage 관련 함수들
function saveFavoriteFilterToStorage(isActive) {
    localStorage.setItem('favoriteFilterActive', JSON.stringify(isActive));
}

function getFavoriteFilterFromStorage() {
    const filterState = localStorage.getItem('favoriteFilterActive');
    return filterState ? JSON.parse(filterState) : false; // 기본값: 비활성화
}

// 정렬 버튼 상태 업데이트
function updateSortButtonStates() {
    sortBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.sort === currentSortType) {
            btn.classList.add('active');
        }
    });
}

// 즐겨찾기 필터 상태 업데이트
function updateFavoriteFilterState() {
    if (isFavoriteFilterActive) {
        favoriteFilterBtn.classList.add('active');
    } else {
        favoriteFilterBtn.classList.remove('active');
    }
}

// 즐겨찾기 관련 함수들
function toggleFavorite(materialId, event) {
    event.stopPropagation(); // 이벤트 버블링 방지
    
    let allMaterials = getAllMaterials();
    const materialIndex = allMaterials.findIndex(m => m.id === materialId);
    
    if (materialIndex !== -1) {
        // 즐겨찾기 상태 토글
        allMaterials[materialIndex].isFavorite = !allMaterials[materialIndex].isFavorite;
        localStorage.setItem('materials', JSON.stringify(allMaterials));
        
        // 현재 표시 중인 자료 목록 업데이트
        loadMaterials();
    }
}

// 즐겨찾기 필터 클릭 처리
function handleFavoriteFilterClick() {
    isFavoriteFilterActive = !isFavoriteFilterActive;
    saveFavoriteFilterToStorage(isFavoriteFilterActive);
    updateFavoriteFilterState();
    loadMaterials();
}

// 검색 관련 함수들
function handleSearchInput(e) {
    currentSearchTerm = e.target.value;
    
    // 검색어가 있으면 지우기 버튼 표시, 없으면 숨기기
    if (currentSearchTerm.trim()) {
        searchClearBtn.style.display = 'flex';
    } else {
        searchClearBtn.style.display = 'none';
    }
    
    // 실시간 검색 결과 업데이트
    loadMaterials();
}

function clearSearch() {
    searchInput.value = '';
    currentSearchTerm = '';
    searchClearBtn.style.display = 'none';
    loadMaterials();
}

// 계절별 배경 설정 함수
function setSeasonalBackground() {
    // 한국표준시(KST) 기준으로 현재 날짜 가져오기
    const today = new Date();
    const kstOffset = 9 * 60; // KST는 UTC+9
    const utc = today.getTime() + (today.getTimezoneOffset() * 60000);
    const kstDate = new Date(utc + (kstOffset * 60000));
    
    const month = kstDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
    
    let season = '';
    
    if (month >= 3 && month <= 5) {
        season = 'spring'; // 봄
    } else if (month >= 6 && month <= 8) {
        season = 'summer'; // 여름
    } else if (month >= 9 && month <= 11) {
        season = 'autumn'; // 가을
    } else {
        season = 'winter'; // 겨울 (12, 1, 2월)
    }
    
    // 기존 계절 클래스 제거
    document.body.classList.remove('spring', 'summer', 'autumn', 'winter');
    
    // 현재 계절 클래스 추가
    document.body.classList.add(season);
    
    console.log(`현재 계절: ${season} (${month}월) - KST 기준`);
}

// 현재 날짜 표시 함수
function displayCurrentDate() {
    // 한국표준시(KST) 기준으로 현재 날짜 가져오기
    const today = new Date();
    const kstOffset = 9 * 60; // KST는 UTC+9
    const utc = today.getTime() + (today.getTimezoneOffset() * 60000);
    const kstDate = new Date(utc + (kstOffset * 60000));
    
    const year = kstDate.getFullYear();
    const month = kstDate.getMonth() + 1;
    const date = kstDate.getDate();
    const day = kstDate.getDay();
    
    // 요일 배열 (한국어)
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = daysOfWeek[day];
    
    // 날짜 형식: '2025년 7월 28일 (월)'
    const formattedDate = `${year}년 ${month}월 ${date}일 (${dayName})`;
    
    // 날짜 표시 업데이트
    dateDisplay.textContent = formattedDate;
    
    console.log(`현재 날짜: ${formattedDate} - KST 기준`);
}

// 미리보기 관련 함수들
function showPreview(materialId, type, url) {
    const previewElement = document.getElementById(`preview-${materialId}-${type}`);
    if (!previewElement) return;
    
    // 로딩 상태 표시
    previewElement.innerHTML = '<div class="preview-loading">미리보기 로딩 중...</div>';
    
    if (type === 'link') {
        // 링크 미리보기
        handleLinkPreview(url, previewElement);
    } else if (type === 'file') {
        // 파일 미리보기
        handleFilePreview(materialId, url, previewElement);
    }
}

function hidePreview(materialId) {
    // 미리보기 숨기기 (CSS로 처리됨)
}

function handleLinkPreview(url, previewElement) {
    // URL이 이미지인지 확인
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const isImage = imageExtensions.some(ext => url.toLowerCase().includes(ext));
    
    if (isImage) {
        // 이미지 미리보기
        const img = new Image();
        img.className = 'preview-image';
        img.onload = () => {
            previewElement.innerHTML = '';
            previewElement.appendChild(img);
        };
        img.onerror = () => {
            previewElement.innerHTML = '<div class="preview-error">이미지를 불러올 수 없습니다</div>';
        };
        img.src = url;
    } else {
        // 일반 링크
        previewElement.innerHTML = '<div class="preview-pdf">🔗 링크<br><small>클릭하여 열기</small></div>';
    }
}

function handleFilePreview(materialId, fileName, previewElement) {
    const material = getAllMaterials().find(m => m.id === materialId);
    if (!material || !material.fileData) {
        previewElement.innerHTML = '<div class="preview-error">파일을 찾을 수 없습니다</div>';
        return;
    }
    
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const pdfExtensions = ['pdf'];
    
    if (imageExtensions.includes(fileExtension)) {
        // 이미지 파일 미리보기
        const img = new Image();
        img.className = 'preview-image';
        img.onload = () => {
            previewElement.innerHTML = '';
            previewElement.appendChild(img);
        };
        img.onerror = () => {
            previewElement.innerHTML = '<div class="preview-error">이미지를 불러올 수 없습니다</div>';
        };
        img.src = material.fileData;
    } else if (pdfExtensions.includes(fileExtension)) {
        // PDF 파일 미리보기
        previewElement.innerHTML = `
            <div class="preview-pdf">
                📄 PDF 문서<br>
                <small>${fileName}</small><br>
                <small>클릭하여 다운로드</small>
            </div>
        `;
    } else {
        // 기타 파일
        previewElement.innerHTML = `
            <div class="preview-pdf">
                📎 파일<br>
                <small>${fileName}</small><br>
                <small>클릭하여 다운로드</small>
            </div>
        `;
    }
}

// 메모 관련 함수들
let currentMemoMaterialId = null;

function openMemoModal(materialId, event) {
    event.stopPropagation(); // 이벤트 버블링 방지
    
    currentMemoMaterialId = materialId;
    const material = getAllMaterials().find(m => m.id === materialId);
    
    if (material && material.memo) {
        // 기존 메모가 있으면 수정 모드
        memoTitle.textContent = '메모 수정';
        memoContent.value = material.memo;
    } else {
        // 새 메모 작성 모드
        memoTitle.textContent = '메모 작성';
        memoContent.value = '';
    }
    
    memoModal.style.display = 'block';
}

function closeMemoModalFunc() {
    memoModal.style.display = 'none';
    memoForm.reset();
    currentMemoMaterialId = null;
}

function handleMemoSubmit(e) {
    e.preventDefault();
    
    const memoText = memoContent.value.trim();
    
    if (memoText) {
        let allMaterials = getAllMaterials();
        const materialIndex = allMaterials.findIndex(m => m.id === currentMemoMaterialId);
        
        if (materialIndex !== -1) {
            allMaterials[materialIndex].memo = memoText;
            allMaterials[materialIndex].memoUpdatedAt = new Date().toISOString();
            localStorage.setItem('materials', JSON.stringify(allMaterials));
            
            closeMemoModalFunc();
            loadMaterials();
        }
    }
}

function deleteMemo(materialId, event) {
    event.stopPropagation(); // 이벤트 버블링 방지
    
    if (confirm('정말로 이 메모를 삭제하시겠습니까?')) {
        let allMaterials = getAllMaterials();
        const materialIndex = allMaterials.findIndex(m => m.id === materialId);
        
        if (materialIndex !== -1) {
            allMaterials[materialIndex].memo = null;
            allMaterials[materialIndex].memoUpdatedAt = null;
            localStorage.setItem('materials', JSON.stringify(allMaterials));
            
            loadMaterials();
        }
    }
}

// 유틸리티 함수들
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// CSS 스타일 추가 (빈 상태 스타일)
const style = document.createElement('style');
style.textContent = `
    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #636e72;
        grid-column: 1 / -1;
    }
    
    .empty-state p {
        margin-bottom: 10px;
        font-size: 1.1rem;
    }
    
    .empty-state p:last-child {
        font-size: 0.9rem;
        color: #b2bec3;
    }
`;
document.head.appendChild(style); 