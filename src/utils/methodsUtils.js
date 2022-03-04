function euclidianDistance(vec1, vec2) {
    const N = vec1.length;
    let d = 0;
    for (let i = 0; i < N; i++)
        d += Math.pow(vec1[i] - vec2[i], 2)
    d = Math.sqrt(d);
    return d;
}

function manhattanDistance(vec1, vec2) {
    const N = vec1.length;
    let d = 0;
    for (let i = 0; i < N; i++)
        d += Math.abs(vec1[i] - vec2[i])
    return d;
}

function maxDistance(vec1, vec2) {
    const N = vec1.length;
    let d = 0;
    for (let i = 0; i < N; i++)
        d = Math.max(d, Math.abs(vec1[i] - vec2[i]));
    return d;
}

function addVectors(vec1, vec2) {
    const N = vec1.length;
    const vec = new Array(N);
    for (let i = 0; i < N; i++)
        vec[i] = vec1[i] + vec2[i];
    return vec;
}

function multiplyVectorByValue(value, vec) {
    const N = vec.length;
    const v = new Array(N);
    for (let i = 0; i < N; i++)
        v[i] = value * vec[i];
    return v;
}

function vectorDotProduct(vec1, vec2) {
    const N = vec1.length;
    let s = 0;
    for (let i = 0; i < N; i++)
        s += vec1[i] * vec2[i];
    return s;
}


function repeatChar(c, n) {
    let str = "";
    for (let i = 0; i < n; i++)
        str += c;
    return str;
}

function calculateCentroid(c1Size, c1Centroid, c2Size, c2Centroid) {
    const newCentroid = new Array(c1Centroid.length);
    const newSize = c1Size + c2Size;
    for (let i = 0; i < c1Centroid.length; i++)
        newCentroid[i] = (c1Size * c1Centroid[i] + c2Size * c2Centroid[i]) / newSize;
    return newCentroid;
}


function centerString(str, width) {
    const diff = width - str.length;
    if (diff < 0)
        return;

    const halfdiff = Math.floor(diff / 2);
    return repeatChar(" ", halfdiff) + str + repeatChar(" ", diff - halfdiff);
}

function putString(str, width, index) {
    const diff = width - str.length;
    if (diff < 0)
        return;

    return repeatChar(" ", index) + str + repeatChar(" ", width - (str.length + index));
}

function prettyVector(vector) {
    const vals = new Array(vector.length);
    const precision = Math.pow(10, figue.PRINT_VECTOR_VALUE_PRECISION);
    for (let i = 0; i < vector.length; i++)
        vals[i] = Math.round(vector[i] * precision) / precision;
    return vals.join(",")
}

function prettyValue(value) {
    const precision = Math.pow(10, figue.PRINT_VECTOR_VALUE_PRECISION);
    return String(Math.round(value * precision) / precision);
}

function generateDendogram(tree, sep, balanced, withLabel, withCentroid, withDistance) {
    const lines = [];
    const centroidstr = prettyVector(tree.centroid);
    if (tree.isLeaf()) {
        const labelstr = String(tree.label);
        let len = 1;
        if (withCentroid)
            len = Math.max(centroidstr.length, len);
        if (withLabel)
            len = Math.max(labelstr.length, len);

        lines.push(centerString("|", len));
        if (withCentroid)
            lines.push(centerString(centroidstr, len));
        if (withLabel)
            lines.push(centerString(labelstr, len));

    } else {
        const distancestr = prettyValue(tree.dist);
        const left_dendo = generateDendogram(tree.left, sep, balanced, withLabel, withCentroid, withDistance);
        const right_dendo = generateDendogram(tree.right, sep, balanced, withLabel, withCentroid, withDistance);
        const left_bar_ix = left_dendo[0].indexOf("|");
        const right_bar_ix = right_dendo[0].indexOf("|");

        // calculate nb of chars of each line
        let len = sep + right_dendo[0].length + left_dendo[0].length;
        if (withCentroid)
            len = Math.max(centroidstr.length, len);
        if (withDistance)
            len = Math.max(distancestr.length, len);


        // calculate position of new vertical bar
        const bar_ix = left_bar_ix + Math.floor((left_dendo[0].length - (left_bar_ix) + sep + (1 + right_bar_ix)) / 2);

        // add line with the new vertical bar
        lines.push(putString("|", len, bar_ix));
        if (withCentroid) {
            lines.push(putString(centroidstr, len, bar_ix - Math.floor(centroidstr.length / 2))); //centerString (centroidstr , len)) ;
        }
        if (withDistance) {
            lines.push(putString(distancestr, len, bar_ix - Math.floor(distancestr.length / 2))); //centerString (centroidstr , len)) ;
        }

        // add horizontal line to connect the vertical bars of the lower level
        const hlineLen = sep + (left_dendo[0].length - left_bar_ix) + right_bar_ix + 1;
        const hline = repeatChar("_", hlineLen);
        lines.push(putString(hline, len, left_bar_ix));

        // IF: the user want the tree to be balanced: all the leaves have to be at the same level
        // THEN: if the left and right subtrees have not the same depth, add extra vertical bars to the top of the smallest subtree
        if (balanced && (left_dendo.length != right_dendo.length)) {
            let shortest;
            let longest;
            if (left_dendo.length > right_dendo.length) {
                longest = left_dendo;
                shortest = right_dendo;
            } else {
                longest = right_dendo;
                shortest = left_dendo;
            }
            // repeat the first line containing the vertical bar
            const header = shortest[0];
            const toadd = longest.length - shortest.length;
            for (let i = 0; i < toadd; i++) {
                shortest.splice(0, 0, header);
            }
        }

        // merge the left and right subtrees
        for (let i = 0; i < Math.max(left_dendo.length, right_dendo.length); i++) {
            let left = "";
            if (i < left_dendo.length)
                left = left_dendo[i];
            else
                left = repeatChar(" ", left_dendo[0].length);

            let right = "";
            if (i < right_dendo.length)
                right = right_dendo[i];
            else
                right = repeatChar(" ", right_dendo[0].length);
            lines.push(left + repeatChar(" ", sep) + right);
            const l = left + repeatChar(" ", sep) + right;
        }
    }

    return lines;
}

function getRandomVectors(k, vectors) {
    /*  Returns a array of k distinct vectors randomly selected from a the input array of vectors
        Returns null if k > n or if there are less than k distinct objects in vectors */

    const n = vectors.length;
    if (k > n)
        return null;

    const selected_vectors = new Array(k);
    const selected_indices = new Array(k);

    const tested_indices = new Object;
    let tested = 0;
    let selected = 0;
    let i, vector, select;
    while (selected < k) {
        if (tested == n)
            return null;

        const random_index = Math.floor(Math.random() * (n));
        if (random_index in tested_indices)
            continue;

        tested_indices[random_index] = 1;
        tested++;
        vector = vectors[random_index];
        select = true;
        for (i = 0; i < selected; i++) {
            if ((JSON.stringify(vector) === JSON.stringify(selected_vectors[i]))) {
                select = false;
                break;
            }
        }
        if (select) {
            selected_vectors[selected] = vector;
            selected_indices[selected] = random_index;
            selected++;
        }
    }
    return {'vectors': selected_vectors, 'indices': selected_indices};
}

function Matrix(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.mtx = new Array(rows);

    for (let i = 0; i < rows; i++) {
        const row = new Array(cols);
        for (let j = 0; j < cols; j++)
            row[j] = 0;
        this.mtx[i] = row;
    }
}

function Node(label, left, right, dist, centroid) {
    this.label = label;
    this.left = left;
    this.right = right;
    this.dist = dist;
    this.centroid = centroid;
    if (left == null && right == null) {
        this.size = 1;
        this.depth = 0;
    } else {
        this.size = left.size + right.size;
        this.depth = 1 + Math.max(left.depth, right.depth);
    }
}

Matrix.prototype.toString = function()
{
    const lines = [] ;
    for (let i = 0 ; i < this.rows ; i++)
        lines.push (this.mtx[i].join("\t")) ;
    return lines.join ("\n") ;
}


Matrix.prototype.copy = function()
{
    const duplicate = new Matrix(this.rows, this.cols) ;
    for (let i = 0 ; i < this.rows ; i++)
        duplicate.mtx[i] = this.mtx[i].slice(0);
    return duplicate ;
}

Node.prototype.isLeaf = function()
{
    if ((this.left == null) && (this.right == null))
        return true ;
    else
        return false ;
}

Node.prototype.buildDendogram = function (sep, balanced,withLabel,withCentroid, withDistance)
{
    const lines = generateDendogram(this, sep, balanced,withLabel,withCentroid, withDistance) ;
    return lines.join ("\n") ;
}

export {
    Node,
    addVectors,
    calculateCentroid,
    centerString,
    euclidianDistance,
    getRandomVectors,
    manhattanDistance,
    maxDistance,
    generateDendogram,
    Matrix,
    multiplyVectorByValue,
    prettyValue,
    prettyVector,
    putString,
    repeatChar,
    vectorDotProduct
}
