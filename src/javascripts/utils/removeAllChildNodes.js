// 자신의 모든 자식 엘레먼트 제거하기

export default (parant) => {
    while (parant.firstChild) {
        parent.removeChild(parant.firstChild);
    }
}