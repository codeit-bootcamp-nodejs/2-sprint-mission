// ProductService.js

// 1) 상품 목록 가져오기
async function getProductList(page = 1, pageSize = 10, keyword = '') {
    try {
      // 서버에 GET 요청 보내기
      const response = await fetch(`https://panda-market-api-crud.vercel.app/products?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error("상품 목록을 가져오는 데 실패했습니다.");
      }
      const data = await response.json();
      console.log("상품 목록:", data);
      return data;
    } catch (error) {
      // 오류 처리
      console.error("오류 발생:", error);
      // 실제 애플리케이션에서는 사용자에게 오류를 알리거나 다른 방식으로 처리할 수 있습니다.
      return null; // 또는 throw error; 로 에러를 다시 던질 수 있습니다.
    }
  }
  
  // 2) 특정 상품 가져오기
  async function getProduct(productId) {
    try {
      // 서버에 GET 요청보내기
      const response = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`);
      if (!response.ok) {
        throw new Error("상품 정보를 가져오는 데 실패했습니다.");
      }
      const data = await response.json();
      console.log("상품 정보:", data);
      return data;
    } catch (error) {
      // 오류처리 하기
      console.error("오류 발생:", error);
      return null;
    }
  }
  
  // 3) 새로운 상품 추가하기 (함수명 수정: getProductList -> createProduct)
  async function createProduct(productData) {
    try {
      // 서버에 POST 요청 보내기
      const response = await fetch("https://panda-market-api-crud.vercel.app/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // appilcation/json -> application/json 오타 수정
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        const errorData = await response.json(); // 서버에서 오는 상세 에러 메시지를 확인하기 위함
        throw new Error(`상품 추가에 실패했습니다: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      console.log("새로운 상품 추가 완료:", data);
      return data;
    } catch (error) {
      // 오류 처리
      console.error("오류 발생:", error);
      return null;
    }
  }
  
  // 4) 기존 상품 수정하기
  async function patchProduct(productId, updatedData) {
    try {
      // 서버에 PATCH 요청 보내기
      const response = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`, { // productld -> productId 오타 수정
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`상품 수정에 실패했습니다: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      console.log("상품 수정 완료:", data);
      return data;
    } catch (error) {
      // 오류 처리
      console.error("오류 발생:", error);
      return null;
    }
  }
  
  // 5) 상품 삭제하기
  async function deleteProduct(productId) {
    try {
      // 삭제 하기
      const response = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`, {
        method: "DELETE"
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`상품 삭제에 실패했습니다: ${errorData.message || response.statusText}`);
      }
      // 삭제 성공 시 보통 204 No Content를 반환하며, 본문(body)이 없을 수 있습니다.
      // response.json()을 호출하면 에러가 발생할 수 있으므로 상태 코드로 성공 여부를 판단합니다.
      console.log(`상품(ID: ${productId}) 삭제 완료`);
      return true; // 성공 여부 반환
    } catch (error) {
      // 오류 처리
      console.error("오류 발생:", error);
      return false; // 실패 여부 반환
    }
  }
  
  // 다른 파일에서 이 함수들을 사용하려면 export 해주어야 합니다.
  export { getProductList, getProduct, createProduct, patchProduct, deleteProduct };