// 부모 엘리먼트로 올라가면서 셀렉터를 만족하는 가장 가까운 요소를 찾는다.
const getClosestElement = (element, selector) => {
    let evaluate = false;
    if(/^\./.test(selector)) { // CASE: 클래스 선택자 
        evaluate = element.classList.contains(selector);
    } else { // CASE: tag 선택자
        evaluate = element.tagName === selector.toUpperCase();
    }

    if(evaluate) {
        return element;
    }

    return getClosestElement(element.parentElement, selector);
}

export default getClosestElement;