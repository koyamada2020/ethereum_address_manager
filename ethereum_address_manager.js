const token_key = '';

let ethjpy;
let ethusd;
let ethbtc;

// 所持数、換算
let totalEth = 0;
let totalJpy = 0;
let totalUsd = 0;
let totalBtc = 0;

async function addAddress() {
    const address = document.getElementById('addressBox').value;
    const memo = document.getElementById('memoBox').value;
    
    // アイコン
    // アドレスアイコン
    const addressIconEl = document.createElement('div');
    addressIconEl.className = 'fas fa-at';
    // Ethアイコン
    const ethIconEl = document.createElement('div');
    ethIconEl.className = 'fab fa-ethereum';
    // 日本円アイコン
    const jpyIconEl = document.createElement('div');
    jpyIconEl.className = 'fas fa-yen-sign';
    // ドルアイコン
    const usdIconEl = document.createElement('div');
    usdIconEl.className = 'fas fa-dollar-sign';
    // Btcアイコン
    const btcIconEl = document.createElement('div');
    btcIconEl.className = 'fab fa-bitcoin';
    // メモアイコン
    const memoIconEl = document.createElement('div');
    memoIconEl.className = 'far fa-sticky-note';
    // 削除アイコン
    const deleteIconEl = document.createElement('div');
    deleteIconEl.className = 'far fa-trash-alt';
    deleteIconEl.addEventListener('click', dialogForDelete, false);

    // ETHアドレス
    const ethAddressEl = document.createElement('div');
    ethAddressEl.textContent = address;

    // ETH数、価格
    const ethEl = document.createElement('div');
    const ethjpyEl = document.createElement('div');
    const ethusdEl = document.createElement('div');
    const ethbtcEl = document.createElement('div');

    // ethの所持数を取得
    const ethBalanceRequestUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${token_key}`;
    const ethBalanceJson = await fetchJsonData(ethBalanceRequestUrl);
    let ethBalance = ethBalanceJson['result'];
    // 小数点第四位まで切り捨てて代入
    ethBalance = ethBalance.slice(0, ethBalance.length - 18) + '.' + ethBalance.slice(ethBalance.length - 18, ethBalance.length - 14);
    ethEl.textContent = ethBalance + 'ETH';
    // 合計量の円建て
    const myethjpy = Math.floor(parseFloat(ethBalance * ethjpy));
    ethjpyEl.textContent = myethjpy + '円';
    // 合計量のドル建て
    const myethusd =  Math.floor(parseFloat(ethBalance * ethusd) * 100) / 100; // 小数点第二位まで切り捨て
    ethusdEl.textContent = '$' + myethusd;
    // 合計量のBTC建て
    const myethbtc = Math.floor(parseFloat(ethBalance * ethbtc) * '10e+8') / '10e+8';
    ethbtcEl.textContent = myethbtc + 'BTC';

    // メモ
    const memoEl = document.createElement('div');
    memoEl.textContent = memo;

    // 表示するデータを配列にまとめる
    const dataArray = [
        [addressIconEl, ethAddressEl],
        [ethIconEl, ethEl],
        [jpyIconEl, ethjpyEl],
        [usdIconEl, ethusdEl],
        [btcIconEl, ethbtcEl],
        [memoIconEl, memoEl]
    ];

    // 表示するデータを組み立て
    const tableEl = document.createElement('table');
    tableEl.className = 'addressBox';
    for (let i = 0; i < dataArray.length; i++) {
        const trEl = document.createElement('tr');
        const tdEl1 = document.createElement('td');
        const tdEl2 = document.createElement('td');

        tdEl1.appendChild(dataArray[i][0]);
        tdEl2.appendChild(dataArray[i][1]);

        trEl.appendChild(tdEl1);
        trEl.appendChild(tdEl2);

        tableEl.appendChild(trEl);
    }
    const boxEl = document.getElementById('box');
    boxEl.appendChild(tableEl);

    // 総所持ETH,通貨換算を更新
    totalEth += parseFloat(ethBalance);
    totalJpy += myethjpy;
    totalUsd += myethusd;
    totalBtc += myethbtc;

    totalUsd = Math.floor(totalUsd * 100) / 100; // 小数点第二位まで切り捨て
    totalBtc = Math.floor(totalBtc * '10e+8') / '10e+8';

    console.log(totalEth, totalJpy,totalUsd,totalBtc);
    const totalEthEl = document.getElementById('totalEth');
    const totalJpyEl = document.getElementById('totalJpy');
    const totalUsdEl = document.getElementById('totalUsd');
    const totalBtcEl = document.getElementById('totalBtc');

    totalEthEl.textContent = totalEth + 'ETH';
    totalJpyEl.textContent = totalJpy + '円';
    totalUsdEl.textContent = '$' + totalUsd;
    totalBtcEl.textContent = totalBtc + 'BTC';


}

// 削除を確認するダイアログを出して削除の選択
function dialogForDelete() {
    const deleteFlag = window.confirm('削除しますか？');
    if (deleteFlag) {
        this.parentNode.remove();
    }
}

// テキストボックス内の文字を削除する
function reset() {
    document.getElementById('addressBox').value = '';
    document.getElementById('memoBox').value = '';
}

async function fetchJsonData(url = ``) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch(error) {
        console.log('error', error);
    }
}

async function init() {
    // ethereumの終値のリクエストURL
    const ethLastPriceUrl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${token_key}`;
    // jsonデータをGETリクエスト
    const ethPriceJson = await fetchJsonData(ethLastPriceUrl);

    ethbtc = ethPriceJson.result['ethbtc'];
    ethusd = ethPriceJson.result['ethusd'];

    // usdjpyの終値を取得 (リクエストは1秒間に1回まで)
    // const usdjpyRequestUrl = 'https://www.gaitameonline.com/rateaj/getrate';
    // const usdjpyPriceJson = await fetchJsonData(usdjpyRequestUrl);

    // const usdjpy = usdjpyPriceJson['quotes'][0]['bid'];
    const usdjpy = 107.5;

    ethjpy = Math.floor(parseFloat(ethusd * usdjpy));

    document.getElementById('ethjpy').textContent = ethjpy + '円';
    document.getElementById('ethusd').textContent = '$' + ethusd;
    document.getElementById('ethbtc').textContent = ethbtc + 'BTC';

    // イベントリスナーの登録
    document.getElementById('add').addEventListener('click', addAddress, false);
    document.getElementById('reset').addEventListener('click', reset, false);
}
window.onload = init;