import {methodsEnum} from "../enums/methodsEmuns";
import { Matrix, multiplyVectorByValue, addVectors, getRandomVectors, euclidianDistance} from "../../utils/methodsUtils";

export const cMeans = (k, vectors, epsilon, fuzziness) => {
    const membershipMatrix = new Matrix (vectors.length, k) ;
    let repeat = true ;
    let nb_iters = 0 ;

    let centroids = null ;

    let i,j,l, tmp, norm, max, diff ;
    while (repeat) {
        // initialize or update centroids
        if (centroids == null) {

            tmp = getRandomVectors(k, vectors) ;
            if (tmp == null)
                return null ;
            else
                centroids = tmp.vectors ;

        } else {
            for (j = 0 ; j < k; j++) {
                centroids[j] = [] ;
                norm = 0 ;
                for (i = 0 ; i < membershipMatrix.rows ; i++) {
                    norm += Math.pow(membershipMatrix.mtx[i][j], fuzziness) ;
                    tmp = multiplyVectorByValue( Math.pow(membershipMatrix.mtx[i][j], fuzziness) , vectors[i]) ;

                    if (i == 0)
                        centroids[j] = tmp ;
                    else
                        centroids[j] = addVectors (centroids[j] , tmp) ;
                }
                if (norm > 0)
                    centroids[j] = multiplyVectorByValue(1/norm, centroids[j]);


            }

        }
        //alert(centroids);

        // update the degree of membership of each vector
        const previousMembershipMatrix = membershipMatrix.copy() ;
        for (i = 0 ; i < membershipMatrix.rows ; i++) {
            for (j = 0 ; j < k ; j++) {
                membershipMatrix.mtx[i][j] = 0;
                for (l = 0 ; l < k ; l++) {
                    if (euclidianDistance(vectors[i] , centroids[l]) == 0)
                        tmp = 0 ;
                    else
                        tmp =  euclidianDistance(vectors[i] , centroids[j]) / euclidianDistance(vectors[i] , centroids[l]) ;
                    tmp = Math.pow (tmp, 2/(fuzziness-1)) ;
                    membershipMatrix.mtx[i][j] += tmp ;
                }
                if (membershipMatrix.mtx[i][j] > 0)
                    membershipMatrix.mtx[i][j] = 1 / membershipMatrix.mtx[i][j] ;
            }
        }

        //alert(membershipMatrix) ;

        // check convergence
        max = -1 ;
        let diff;
        for (i = 0 ; i < membershipMatrix.rows ; i++)
            for (j = 0 ; j < membershipMatrix.cols ; j++) {
                diff = Math.abs(membershipMatrix.mtx[i][j] - previousMembershipMatrix.mtx[i][j]) ;
                if (diff > max)
                    max = diff ;
            }

        if (max < epsilon)
            repeat = false ;

        nb_iters++ ;

        // check nb of iters
        if (nb_iters > methodsEnum.FCMEANS_MAX_ITERATIONS)
            repeat = false ;
    }
    return { 'centroids': centroids , 'membershipMatrix': membershipMatrix} ;

}
