var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

//O(n^2) solution
var handleResponse = function(data,status) {
    console.log(data.length);
    console.time("execTime")
    var currMedian=0; 
    var arrConvRates=[];

    for (var i=0; i<data.length; i++){
        var convRate = data[i].rates.USD != 0 ? data[i].rates.SEK/data[i].rates.USD : 0;

        if(arrConvRates.length>0){
            for (var j=0; j < arrConvRates.length; j++){
                if(convRate<arrConvRates[j]){
                    arrConvRates.splice(j,0,convRate)
                    break
                }else if(j == arrConvRates.length-1){ //and thisConvRate > ...
                    arrConvRates.push(convRate);
                    break
                }
            }
        }else{
            arrConvRates.push(convRate)
        }

        var half = Math.floor(arrConvRates.length/2);
        if (arrConvRates.length % 2 == 0) {
            currMedian = (arrConvRates[half-1]+arrConvRates[half])/2
        }else{
            currMedian = arrConvRates[half]
        }

    }
    console.timeEnd("execTime")
    console.log("Median: "+currMedian)
}

var heapSolution = function(data,status){
    var median = 0;
    var left = new maxHeap();
    var right = new minHeap();

    for (var i=0; i<data.length;i++){
        var convRate = data[i].rates.USD != 0 ? data[i].rates.SEK/data[i].rates.USD : 0;
        console.log("1: " + convRate+", l: "+JSON.stringify(left)+", r: "+JSON.stringify(right))
        median = getMedian(median,convRate,left,right)
        console.log("Median: "+median)
    }
    return median;
}

var a = [{"rates":{"USD": 1.7,"SEK": 10.9}},{"rates":{"USD": 1.4389,"SEK": 10.8}},{"rates":{"USD": 1.4389,"SEK": 10.2}},{"rates":{"USD": 1.4389,"SEK": 10.5}},{"rates":{"USD": 1.4389,"SEK": 12}},{"rates":{"USD": 1.4389,"SEK": 10.193}},{"rates": {"USD": 1.4442, "SEK": 10.212}}]
console.log(heapSolution(a));

//$.get("http://fx.modfin.se/2016-01-01/2017-06-30?symbols=usd,sek", handleResponse);
//$.get("http://fx.modfin.se/2016-01-01/2017-12-31?symbols=usd,sek", handleResponse);

function fInsert(val){
    console.log("insert")
    this.data.push(val);
    this.bubbleUp(this.data.length-1);
}

function fPeek(){
    console.log("peek")
    var val = -1;
    if (this.data.length > 0){
        val = this.data[0]
    }
    return val
}

function fExtractTop(){
    console.log("extracttop")
    var len = this.data.length
    if (len == 1){
        return this.data.pop();
    }else{
        var top = this.data[0]
        this.data[0] = this.data.pop();
        var i = 0;
        while(true) {
            var idxLeft = 2*i+1;
            var idxRight = 2*i+2;
            var idxLargest = i;

            if (idxLeft <= len && this.comp(this.data[idxLargest],this.data[idxLeft])){
                idxLargest = idxLeft;
            }
            if (idxRight <= len && this.comp(this.data[idxLargest],this.data[idxRight])){
                idxLargest = idxRight;
            }
            if (idxLargest != i){
                var swap = this.data[i]
                this.data[i] = this.data[idxLargest]
                this.data[idxLargest] = swap
                i = idxLargest
            } else {
                break
            }
        }
        return top;
    }
}

function fBubbleUp(index){
    console.log("bubbleup")
    while(index > 0){
        var parent = Math.floor((index+1)/2)-1;

        if (this.comp(this.data[parent],this.data[index])){
            var swap = this.data[parent]
            this.data[parent] = this.data[index]
            this.data[index] = swap
        }

        index = parent;
    }
}

function maxHeap(){
    this.data=[];
    this.insert = fInsert;
    this.peek = fPeek;
    this.extractTop = fExtractTop;
    this.bubbleUp = fBubbleUp
    this.comp = function(a, b){
        return (a < b);
    }
}

function minHeap(){
    this.data=[];
    this.insert = fInsert;
    this.peek = fPeek
    this.extractTop = fExtractTop;
    this.bubbleUp = fBubbleUp
    this.comp = function(a, b){
        return (a > b);
    }
}

function getMedian(m,x,left,right){
    var newM;

    if(left.data.length < right.data.length){
        console.log("a, x= "+x+", m= "+m)
        if(x<m){
            left.insert(x)
        }else{
            left.insert(right.extractTop())
            right.insert(x)
        }
        newM = (right.peek() + left.peek())/2
    }else if(left.data.length == right.data.length){
        console.log("b, x= "+x+", m= "+m)
        if(x<m){    
            left.insert(x)
            newM = left.peek();
        }else{
            right.insert(x)
            newM = right.peek();
        }
    }else{
        console.log("c, x= "+x+", m= "+m)
        if(x<m){
            right.insert(left.extractTop())
            left.insert(x)
        }else{
            right.insert(x)
        }
        newM = (right.peek() + left.peek())/2
    }

    return newM;
}