import {methodsEnum} from "../enums/methodsEmuns";
import { euclidianDistance, addVectors, multiplyVectorByValue, getRandomVectors} from "../../utils/methodsUtils";

export const kMeans = (k, vectors) => {
    const n = vectors.length ;
    const assignments = new Array(n) ;
    const clusterSizes = new Array(k) ;
    let repeat = true ;
    let nb_iters = 0 ;
    let centroids = null ;

    const t = getRandomVectors(k, vectors) ;
    if (t == null)
        return null ;
    else
        centroids = t.vectors ;

    while (repeat) {

        // assignment step
        for (let j = 0 ; j < k ; j++)
            clusterSizes[j] = 0 ;

        for (let i = 0 ; i < n ; i++) {
            const vector = vectors[i] ;
            let mindist = Number.MAX_VALUE ;
            let best;
            for (let j = 0 ; j < k ; j++) {
                const dist = euclidianDistance (centroids[j], vector)
                if (dist < mindist) {
                    mindist = dist ;
                    best = j ;
                }
            }
                clusterSizes[best]++;
                assignments[i] = best;
        }

        // update centroids step
        const newCentroids = new Array(k) ;
        for (let j = 0 ; j < k ; j++)
            newCentroids[j] = null ;

        for (let i = 0 ; i < n ; i++) {
            const cluster = assignments[i] ;
            if (newCentroids[cluster] == null)
                newCentroids[cluster] = vectors[i] ;
            else
                newCentroids[cluster] = addVectors (newCentroids[cluster] , vectors[i]) ;
        }

        for (let j = 0 ; j < k ; j++) {
            newCentroids[j] = multiplyVectorByValue (1/clusterSizes[j] , newCentroids[j]) ;
        }

        // check convergence
        repeat = false ;
        for (let j = 0 ; j < k ; j++) {
            if (JSON.stringify(newCentroids[j]) !== JSON.stringify(centroids[j])) {
                repeat = true ;
                break ;
            }
        }
        centroids = newCentroids ;
        nb_iters++ ;

        // check nb of iters
        if (nb_iters > methodsEnum.KMEANS_MAX_ITERATIONS)
            repeat = false ;

    }
    return { 'centroids': centroids , 'assignments': assignments} ;

}
