# 自動提前加入google meet(限明道中學)
做完以下配置之後點開start.bat

## Environment

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