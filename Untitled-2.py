def solution(K, A):
    # write your code in Python 3.6
    M = len(A)
    N = len(A[0])
    store_locs = []
    for i in range(M):
        for j in range(N):
            if A[i][j] == 1: #found a house
                store_locs.append(find_stores(K, A, i, j))
                print("shit")
            
    
    return 0
    
def find_stores(K, A, house_x, house_y):
    stores = []
    while K > 0:
        i = -1*K
        while (i <= K):
            y = house_y + i
            x = house_x + K - abs(i)
            if (y <0 or y>= len(A) or x >= len(A[0]) or A[y][x] == 1):
                continue
            else:
                stores.append((x, y))
            i+=1
            print(i)
        i = -1*K
        while (i <= K):
            y = house_y + i
            x = house_x + (-1 * (K - abs(i)))
            if (y <0 or y>= len(A) or x >= len(A[0]) or A[y][x] == 1):
                continue
            else:
                stores.append((x, y))
            i+=1
        K-=1
    
    return stores