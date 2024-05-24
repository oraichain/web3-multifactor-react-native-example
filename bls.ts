import {Field} from '@noble/curves/abstract/modular';
import {bls12_381} from  '@noble/curves/bls12-381';

const PrimeFieldModulus = 52435875175126190479447740508185965837690552500527637822603658699938581184513n;
const Fr = Field(PrimeFieldModulus,255);
const G1 = bls12_381.G1
const basePoint = G1.ProjectivePoint;

// class Poly {
//     coeff:bigint[] = []
    
//     constructor(coeff:bigint[]){
//         this.coeff = coeff
//     }

//     static constant(coeff: bigint){
//         return new Poly([coeff])
//     }

//     static interpolate(dataPoints:[bigint,bigint][]){
//         if(dataPoints.length == 0){
//             return Poly.constant(0n)
//         }

//         let poly = new Poly([dataPoints[0][1]]);
//         let minusS0 = dataPoints[0][0];
//         minusS0 = Fr.neg(minusS0);
//         console.log(dataPoints[1][1].toString(16));
//         let base = new Poly([minusS0, 1n]);

//         for(const [x, y] of dataPoints.slice(1)){
//             let diff = y;
//             console.log("diff", diff.toString(16));
//             diff = Fr.sub(diff, poly.evaluate(x));
//             let base_val = base.evaluate(x);
//             diff = Fr.mul(diff, Fr.inv(base_val));
//             base.mulFr(diff);
//             poly.add(base);
//             base.mul(new Poly([Fr.neg(x), 1n]));
//         }
//         return poly;
//     }

//     add(rhs: Poly){
//         const len = this.coeff.length;
//         const rhs_len = rhs.coeff.length;

//         if(rhs_len > len){
//             const fillFr = new Array(rhs_len - len).fill(0n);
//             this.coeff = this.coeff.concat(fillFr);
//         }

//         this.coeff = this.coeff.map((coeff, index) => {
//             return Fr.add(coeff,rhs.coeff[index])
//         })

//         this.removeZeroes();
//     }

//     mul(rhs:Poly){
//         if(this.isZero() || rhs.isZero()){
//             return Poly.constant(0n)
//         }
//         const len = this.coeff.length + rhs.coeff.length - 1;
//         let coeff = new Array(len).fill(0n);
//         let tmp = 0n;
//         let i, j = 0;
//         for(i = 0; i < this.coeff.length; i++){
//             for(j = 0; j < rhs.coeff.length; j++){
//                 tmp = Fr.mul(this.coeff[i], rhs.coeff[j]);
//                 coeff[i+j] = Fr.add(coeff[i+j], tmp);
//             }
//         }
//        this.coeff = coeff;
//     }

//     mulFr(rhs:bigint){
//         if(rhs === 0n){
//             this.coeff = [0n];
//         } else {
//             this.coeff = this.coeff.map((coeff) => {
//                 return Fr.mul(coeff, rhs)
//             });
//         }
//     }

//     evaluate(x: bigint){
//         let result = this.coeff[this.coeff.length-1];
//         for(let i = this.coeff.length-2; i >= 0; i--){
//             result = Fr.add(Fr.mul(result, x),this.coeff[i]);
//         }
//         return result
//     }

//     removeZeroes(){
//         for(let i = this.coeff.length-1; i >= 0; i--){
//             if(this.coeff[i] === 0n){
//                 this.coeff.pop()
//             } else {
//                 break;
//             }
//         }
//     }

//     isZero(){
//         return !this.coeff.some(coeff => !(coeff === 0n))
//     }

// }
export const interpolate = (dataPoints:[bigint,bigint][], index: bigint)=>{
    let result = 0n; // term result 
    for(let i = 0; i < dataPoints.length; i++){
        let term = dataPoints[i][1]; // y value
        for(let j = 0; j < dataPoints.length; j++){
            if(i != j){
                const diff_index = Fr.sub(index, dataPoints[j][0]);
                const diff_i = Fr.sub(dataPoints[i][0], dataPoints[j][0]);
                term = Fr.mul(term, diff_index);
                term = Fr.div(term, diff_i);
            }
        }
        result = Fr.add(result,term);
    }
    return result;
}

export function getPairFromSharesAndIndexes(dataPoints:[bigint,bigint][]){
    const privateKey = interpolate(dataPoints, 0n);
    const pubKey = basePoint.BASE.multiply(privateKey).toHex();
    return {privKey:privateKey.toString(16) , pubKey};
}

// (()=>{
//     let shares = ["6f569904269aef285688a23a4991ba590b9fe4471b0a2d64ec0cca311b6bd78a", 
//     "0fa02b2b0a69946bc83ee96d0df6e6656d3d87306b29872ae638e559c30d63e0", 
//     "1eb6fbab0706e58e5659eca4276d38253d9ee615858a93c6c7952141a3367485"];
//     let indexes = ["01", "02", "03"];
//     const shareAndIndexes:[bigint,bigint][] = shares.map((share, index) => 
//         [BigInt(parseInt(indexes[index], 16)), BigInt("0x" + share)]);
//     const poly = Poly.interpolate(shareAndIndexes.slice(0,3));
//     console.log(getPairFromSharesAndIndexes(shareAndIndexes));
//     console.log(poly.coeff.map(coeff => coeff.toString(16)));
//     const secret = poly.evaluate(0n);
//     const pubkeyKey = basePoint.BASE.multiply(secret);
//     console.log(pubkeyKey.toHex());
//     console.log(secret.toString(16));
//     //  privateKey: 55fef690085ffb339ac366fbc6fa03f5714ab553952fce76d910cfc9ac51cf81
//     //  pubkey: 92ccef9a7fe47e1df29d24aca9e11d00d2405a2459431349398eed46bb411115026ddb984a09b0de9cf59d1f66e5cbb7
// })()