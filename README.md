# 更好的 Minecraft 廢土伺服器機器人

## 📚 介紹
這是個具有許多功能的廢土機器人，且完全**免費**與**開源**  
另一大特色就是具有容易操作的界面，而不是傳統的小黑窗，讓任何人都能夠輕鬆使用~

詳細功能請看 [這裡](#-功能)  
祝您使用愉快！

![image](https://user-images.githubusercontent.com/48402225/182107013-46ffdf0b-f27c-47d6-862f-e01a2986dd44.png)

## 🎮 下載
本軟體支援 Windows、Linux、macOS 作業系統，另外僅支援 64 位元的電腦。

[前我前往下載頁面](https://github.com/SiongSng/Better-MCFallout-Bot/releases/latest)

## 🎨 功能
### ***自動刷突襲塔***
自動攻擊突襲塔的怪物，獲得滿滿的綠寶石 💵💵💵 。

### 自動掛機
對就是掛機，看似很一般的功能，但不用開啟麥塊本體就可以輕鬆掛物資。  
~~雖然我不是數學家，但這聽起來還不錯對吧~~
### 自動飲食
自動飲食，肉、蔬菜、湯都支援，可以防止餓死 (腐肉是黑名單)。

### 自動丟棄物品
自動丟棄不重要的物品，保留重要物品，像是武器、不死圖騰、食物、裝備，在刷突襲塔的時候很有用。

### 自動重新連線
自動重新連線伺服器，如果突然斷線或者廢土伺服器當機，會每 30 秒自動重新連線一次，若失敗超過 10 次則自動暫停。

## 🪟 截圖
![image](https://user-images.githubusercontent.com/48402225/182106836-05185041-ecea-424f-833c-512fe81abd4a.png)

## ⚙️ 開發

首先請先安裝 [Flutter SDK](https://docs.flutter.dev/get-started/install) 與 [Node.js](https://nodejs.org/download).

### VSCode
另外請安裝 [Flutter 的擴充套件](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter)  
接著切換到執行的分頁並點擊小綠旗稍等一下就可以囉~  

![image](https://user-images.githubusercontent.com/48402225/182102401-d76f2745-c81b-458c-99cb-4999c7c9ee9d.png)

### CLI
並執行以下指令，稍等幾分鐘應該就會跳出畫面

Windows
```shell
script/dev_windows.bat
```

Linux
```bash
bash script/dev_linux.sh
```

macOS
```shell
bash script/dev_macos.sh
```

### Technologies
[Flutter](https://flutter.dev)  
[Dart](https://dart.dev)  
[Typescript](https://www.typescriptlang.org)  
Javascript  
[Node.js](https://nodejs.org)  
[Mineflayer](https://github.com/PrismarineJS/mineflayer)