#include <stdio.h>
#include <memory.h>
#define swap(x,y) (t)=(x),(x)=(y),(y)=(t)

int t;

void printArr(int *a, int len){
  for(int i=0; i<len; ++i){
    printf("| %d ", a[i]);
  }puts("|\n");
}

int* selectionSort(int* a, int len){
  // for(int i=0; i<len-1; ++i){
  //   int m=i;
  //   for(int j=i+1; j<len; ++j){
  //     if(a[m]>a[j]) m=j;
  //   }
  //   if(m!=i) swap(a[i], a[m]);
  // }

  for(int i=0,j=len-1; i<j; ++i,--j){
    int m=i,M=j;
    for(int I=i+1,J=j-1; I<len-i && J>=i; ++I,--J){
      if(a[m]>a[I]) m=I;
      if(a[M]<a[J]) M=J;
    }

    if(m!=i){
      swap(a[m], a[i]);
      if(M==i) M=m;
    }
    if(M!=j) swap(a[M], a[j]);
  }

  return a;
}

int* insertSort(int *a, int len){
  for(int i=0; i<len-1; ++i){
    int m=i;
    for(int j=i+1; j<len; ++j){
      if(a[m]>a[j])m=j;
    }
    if(m!=i){
      t=a[m];
      for(int j=m; j>i; --j){
        a[j]=a[j-1];
      }
      a[i]=t;
    }
  }
  return a;
}

int* mergeSort(int *a, int s, int e){
  if(s==e) return a;

  int m = (s+e)/2;
  
  mergeSort(a,s,m);
  mergeSort(a,m+1,e);

  int A[e-s+1];
  memset(A, 0, sizeof(A));

  // for(int i=s,j=m+1; i<=m || j<=e;){
  //   while(i<=m && a[i]<=a[j] || j>e && b<e-s+1) A[b++]=a[i++];
  //   while(j<=e && a[i]>a[j] || i>m && b<e-s+1) A[b++]=a[j++];
  // }

  for(int b=0,i=s,j=m+1; b<e-s+1;++b){
    if(i>m) A[b]=a[j++];
    else if(j>e) A[b]=a[i++];
    else if(a[i]<=a[j]) A[b]=a[i++];
    else A[b]=a[j++];
  }

  for(int i=0; i<e-s+1;++i){
    a[s+i]=A[i];
  }

  return a;
}

int* quickSort(int* a, int s, int e){

  int p=a[(s+e)/2];
  int l=s, r=e;

  while(l<=r){
    while(a[l] < p) l++;
    while(p < a[r]) r--;

    if(l<=r){
      swap(a[l], a[r]);
      l++;
      r--;
    }
  }

  printArr(a,13);

  if(s<r) quickSort(a,s,r);
  if(l<e) quickSort(a,l,e);

  return a;
}

int main(){
  int a[] = {2, 5, 1, 7, 10, 3, 11, 8, 12, 4, 9, 13, 6};
  int len = sizeof(a) / sizeof(int);

  // printArr(selectionSort(a,len),len);
  // printArr(insertSort(a,len),len);
  // printArr(mergeSort(a,0,len-1),len);
  printArr(quickSort(a,0,len-1),len);
  return 0;
}