# 自動提前加入google meet(限明道中學)
做完以下配置之後點開start.bat

## 🛠️ Environment

在專案資料夾內創建一個名為.env的檔案然後在裡面配置下以下資訊

`ACCOUNT`: 學校google帳號

`PASSWD`: google帳號密碼

`STDID`: 明道學生帳號(抓取課表需要)

`STDPWD`: 學生帳號密碼

`MORNING`: 早修會議連結

#### .env 範例

```
ACCOUNT=學校google帳號
PASSWD=google帳號密碼
STDID=學生帳號密碼
STDPWD=學生帳號密碼
MORNING=早修會議連結
```
## 📜備註

1. 電腦需安裝NodeJS、FireFox
2. 請確定geckodriver.exe的版本與電腦firefox保持相同

[Firefox driver download](https://github.com/mozilla/geckodriver/releases)

[FireFox download](https://www.mozilla.org/zh-TW/firefox/new/)

[NodeJS download](https://nodejs.org/en/)

## ⚡狀態

![Alt](https://repobeats.axiom.co/api/embed/95061a4041e5f3108f72145d1a3a6a098ee4f33e.svg "Repobeats analytics image")