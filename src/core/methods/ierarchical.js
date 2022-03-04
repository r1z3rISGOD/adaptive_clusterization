import {methodsEnum} from "../enums/methodsEmuns";
import {
    calculateCentroid,
    Node,
    Matrix,
    euclidianDistance,
    manhattanDistance,
    maxDistance
} from "../../utils/methodsUtils";

export const ierarchical = (labels, vectors, distance, linkage) => {
    const N = vectors.length ;
    const dMin = new Array(N) ;
    const cSize = new Array(N) ;
    const matrixObj = new Matrix(N,N);
    const distMatrix = matrixObj.mtx ;
    const clusters = new Array(N) ;

    let c1, c2, c1Cluster, c2Cluster, i, j, p, root , newCentroid, newCluster ;

    if (distance == methodsEnum.EUCLIDIAN_DISTANCE)
        distance = euclidianDistance ;
    else if (distance == methodsEnum.MANHATTAN_DISTANCE)
        distance = manhattanDistance ;
    else if (distance == methodsEnum.MAX_DISTANCE)
        distance = maxDistance ;

    // Initialize distance matrix and vector of closest clusters
    for (i = 0 ; i < N ; i++) {
        dMin[i] = 0 ;
        for (j = 0 ; j < N ; j++) {
            if (i == j)
                distMatrix[i][j] = Infinity ;
            else
                distMatrix[i][j] = distance(vectors[i] , vectors[j]) ;

            if (distMatrix[i][dMin[i]] > distMatrix[i][j] )
                dMin[i] = j ;
        }
    }

    // create leaves of the tree
    for (i = 0 ; i < N ; i++) {
        clusters[i] = [] ;
        clusters[i][0] = new Node (labels[i], null, null, 0, vectors[i]) ;
        cSize[i] = 1 ;
    }

    // Main loop
    for (p = 0 ; p < N-1 ; p++) {
        // find the closest pair of clusters
        c1 = 0 ;
        for (i = 0 ; i < N ; i++) {
            if (distMatrix[i][dMin[i]] < distMatrix[c1][dMin[c1]])
                c1 = i ;
        }
        c2 = dMin[c1] ;

        // create node to store cluster info
        c1Cluster = clusters[c1][0] ;
        c2Cluster = clusters[c2][0] ;

        newCentroid = calculateCentroid ( c1Cluster.size , c1Cluster.centroid , c2Cluster.size , c2Cluster.centroid ) ;
        newCluster = new Node (-1, c1Cluster, c2Cluster , distMatrix[c1][c2] , newCentroid) ;
        clusters[c1].splice(0,0, newCluster) ;
        cSize[c1] += cSize[c2] ;

        // overwrite row c1 with respect to the linkage type
        for (j = 0 ; j < N ; j++) {
            if (linkage == methodsEnum.SINGLE_LINKAGE) {
                if (distMatrix[c1][j] > distMatrix[c2][j])
                    distMatrix[j][c1] = distMatrix[c1][j] = distMatrix[c2][j] ;
            } else if (linkage == methodsEnum.COMPLETE_LINKAGE) {
                if (distMatrix[c1][j] < distMatrix[c2][j])
                    distMatrix[j][c1] = distMatrix[c1][j] = distMatrix[c2][j] ;
            } else if (linkage == methodsEnum.AVERAGE_LINKAGE) {
                const avg = ( cSize[c1] * distMatrix[c1][j] + cSize[c2] * distMatrix[c2][j])  / (cSize[c1] + cSize[j])
                distMatrix[j][c1] = distMatrix[c1][j] = avg ;
            }
        }
        distMatrix[c1][c1] = Infinity ;

        // infinity ­out old row c2 and column c2
        for (i = 0 ; i < N ; i++)
            distMatrix[i][c2] = distMatrix[c2][i] = Infinity ;

        // update dmin and replace ones that previous pointed to c2 to point to c1
        for (j = 0; j < N ; j++) {
            if (dMin[j] == c2)
                dMin[j] = c1;
            if (distMatrix[c1][j] < distMatrix[c1][dMin[c1]])
                dMin[c1] = j;
        }

        // keep track of the last added cluster
        root = newCluster ;
    }

    return root ;
}
