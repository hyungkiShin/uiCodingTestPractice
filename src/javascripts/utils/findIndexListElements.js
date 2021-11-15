// 리스트안에서 엘리먼트의 인덱스 번호를 찾는 함수.
const findIndexListdElement = (element) => {
  const listItems = element.parentElement.querySelectorAll("li");
  const currentIndex = Array.prototype.slice
    .call(listItems)
    .findIndex((listItem) => listItem == element);
    
    return currentIndex;
};

export default findIndexListdElement;