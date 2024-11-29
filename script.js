const drawer = document.getElementById("drawer-container");
const purchase = document.getElementById("purchase-btn");
const input = document.getElementById("cash");
const output = document.getElementById("change-due");

let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const money = [
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.1],
  ['QUARTER', 0.25 ],
  ['ONE', 1 ],
  ['FIVE', 5 ],
  ['TEN', 10 ],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
];

cid.forEach((cash)=>{
    if(cash[0][cash[0].length-1]=="Y"){
      cash[0] = cash[0].slice(0, -1) + "IES";
    }else{
      cash[0] += "S"
    }
})


purchase.addEventListener("click", ()=>{
  output.innerText = "";
  if(input.value == price){
    output.innerText = "Status: CLOSED";
    output.innerHTML = `<p>No change due - customer paid with exact cash</p>`
    input.value="";
    return;
  }else if(input.value < price){
    alert(`Customer does not have enough money to purchase the item`)
    input.value="";
    return;
  }else{
    calculate(input.value);
    input.value="";
    return;
  }
})

const calculate = (input)=>{
  let isAllZero = 0;
  let moneyVar = []
  money.forEach((cash)=>{
    moneyVar.push(cash[1])
  })
  moneyVar.reverse()


  let cidVar = []
  cid.forEach((cash)=>{
    cidVar.push(cash[1])
  })
  cidVar.reverse()
  
  let target = (Math.round((input-price)*100)/100)
  let sum = 0;
  
  let reset = [];
  cidVar.forEach((cash)=>{
  reset.push(cash)
  });
  
  let change = [];
  let j=0;
  
  
  if(sum != target){
    for(let i=0; i<moneyVar.length; i++){
      if(moneyVar[i] < target){
        
        while(sum < target && Math.round((sum+moneyVar[i])*100)/100 <= target && Math.round((cidVar[i]-moneyVar[i])*100)/100 >= 0){
          change[j] = moneyVar[i]
          j++;
          sum += moneyVar[i]
          sum = (Math.round(sum*100)/100)
          cidVar[i] = cidVar[i]-moneyVar[i];
          cidVar[i] = (Math.round(cidVar[i]*100)/100)
        } 
      }
    }
  }

  //these handles if the target isn't met
  isAllZero = cidVar.every(item => item === 0);
  if(isAllZero && sum != target){
    cidVar = reset;
    sum = 0;
  }
  if(!isAllZero && sum != target){
    cidVar = reset;
    sum = 0;
  }
  //these handles if the target isn't met
  
  cidVar.reverse()
  cid.forEach((cash, index)=>{
    cash[1] = cidVar[index]
  })
  updateDrawer();
  cidVar.reverse()
  checkStatus()
  

  function checkStatus (){
  if(isAllZero && sum == target){
      output.innerText = "Status: CLOSED";
      updateChange(change)
    }
  if(!isAllZero && sum != target){
    output.innerText += "Status: INSUFFICIENT_FUNDS";
  }
  if(!isAllZero && sum == target){
    
    output.innerText += "Status: OPEN";
    updateChange(change);
  }
  if(isAllZero && sum != target){
    output.innerText += "Status: INSUFFICIENT_FUNDS";
  }
}
}



const updateChange = (arr) =>{
  const changes = {}
  arr.forEach(cash=>{
    if(!changes[cash]){
      changes[cash] = 1;
    }else{
      changes[cash]++
    }
  })
  
  let amount=[];
  let type=[];
  money.forEach((cash,index)=>{
    if(changes[cash[1]]){
      let product = changes[cash[1]]*cash[1] 
      product = (Math.round(product*100)/100)
      amount.push(product);
      type.push(cash[0]);
    }
  })
  amount.reverse()
  type.reverse()
  
  amount.forEach((cash, index)=>{
    output.innerHTML +=`<p>${type[index]}: $${cash}</p>`;
  })
  
}

const updateDrawer =() =>{
  drawer.innerHTML = `<p id="price">Price: $${price}</p>
  <p id="drawer-text">Change in drawer: </p>`;
  cid.forEach((cash)=>{
    drawer.innerHTML += `<p><span id="amount-type">${cash[0]}:</span> <b>$${cash[1]}</b></p>`;
  })
}

updateDrawer();
