import {db} from "./firebase-config.js";
import{collection, query, orderBy, limit, getDocs, startAfter,startAt} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const pageSize = 16;
let firstVisible = null;
let lastVisible = null;
let pageStack = [];

export async function getProducts(next) {
    let q;
    
    if(next && lastVisible){
        //load next 16 products
        if(next && lastVisible){
       pageStack.push({first:firstVisible, last:lastVisible});
        } 
        q=query(collection(db,"products"), orderBy("createdAt","desc"),startAfter(lastVisible),limit(pageSize));
    
    }else if(!next && pageStack.length>0 ){
        //go back to previos page
        const pervCursor = pageStack.pop();
        q=query(collection(db,"products"), orderBy("createdAt","desc"),startAt(pervCursor.first),limit(pageSize));
    
    }else{
        //First page
         q=query(collection(db,"products"), orderBy("createdAt","desc"),limit(pageSize));
    }

    const snap = await getDocs(q);
    if(snap.empty) return [];

    //Update cursor for pagination

    const docs = snap.docs.map((d)=> {
        const data = d.data();
        data.id = d.id;
        return data;
    });
    
    firstVisible = snap.docs[0];
    lastVisible=snap.docs[snap.docs.length-1];

    return docs;


}