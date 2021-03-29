# Concurrent::Promises.futureを使うと、WebSocketコールバック順序がぐちゃぐちゃになる問題の再現

```
node server.js
```

でlocalhost:5001にWebSocketサーバーを建てる。

で、Ruby側のクライアントがコールバック処理をConcurrent::Promises.futureをつかってやると・・・

```
$ bundle exec ruby client.rb
WS=>This is 0
WS=>This is 1
WS=>This is 2
RECV: This is 0
RECV: This is 2
WS=>This is 3
WS=>This is 4
RECV: This is 1
RECV: This is 3
WS=>This is 5
WS=>This is 6
WS=>This is 7
WS=>This is 8
WS=>This is 9
WS=>This is 10
WS=>This is 11
RECV: This is 7
RECV: This is 5
RECV: This is 8
RECV: This is 6
RECV: This is 9
RECV: This is 4
RECV: This is 10
WS=>This is 12
RECV: This is 11
RECV: This is 12
WS=>This is 13
WS=>This is 14
WS=>This is 15
RECV: This is 13
RECV: This is 15
WS=>This is 16
WS=>This is 17
WS=>This is 18
RECV: This is 14
RECV: This is 17
RECV: This is 18
WS=>This is 19
WS=>This is 20
RECV: This is 16
RECV: This is 20
WS=>This is 21
WS=>This is 22
RECV: This is 19
WS=>This is 23
RECV: This is 21
RECV: This is 23
RECV: This is 22
WS=>This is 24
WS=>This is 25
RECV: This is 24
RECV: This is 25
WS=>This is 26
WS=>This is 27
RECV: This is 26
RECV: This is 27
WS=>This is 28
WS=>This is 29
RECV: This is 28
RECV: This is 29
WS=>This is 30
WS=>This is 31
WS=>This is 32
RECV: This is 30
RECV: This is 32
WS=>This is 33
WS=>This is 34
WS=>This is 35
RECV: This is 33
RECV: This is 35
RECV: This is 34
WS=>This is 36
WS=>This is 37
RECV: This is 31
RECV: This is 37
WS=>This is 38
WS=>This is 39
RECV: This is 36
WS=>This is 40
WS=>This is 41
RECV: This is 38
RECV: This is 40
RECV: This is 39
RECV: This is 41
WS=>This is 42
WS=>This is 43
WS=>This is 44
RECV: This is 42
RECV: This is 44
RECV: This is 43
WS=>This is 45
WS=>This is 46
RECV: This is 45
RECV: This is 46
WS=>This is 47
WS=>This is 48
RECV: This is 47
RECV: This is 48
WS=>This is 49
WS=>This is 50
RECV: This is 49
WS=>This is 51
WS=>This is 52
RECV: This is 50
WS=>This is 53
RECV: This is 51
RECV: This is 53
WS=>This is 54
WS=>This is 55
RECV: This is 52
RECV: This is 55
WS=>This is 56
WS=>This is 57
WS=>This is 58
RECV: This is 56
RECV: This is 54
RECV: This is 57
WS=>This is 59
WS=>This is 60
RECV: This is 58
RECV: This is 60
RECV: This is 59
WS=>This is 61
WS=>This is 62
RECV: This is 61
RECV: This is 62
WS=>This is 63
WS=>This is 64
RECV: This is 63
RECV: This is 64
WS=>This is 65
WS=>This is 66
RECV: This is 65
RECV: This is 66
WS=>This is 67
WS=>This is 68
RECV: This is 67
WS=>This is 69
WS=>This is 70
RECV: This is 68
RECV: This is 69
WS=>This is 71
WS=>This is 72
WS=>This is 73
RECV: This is 71
RECV: This is 70
RECV: This is 72
WS=>This is 74
WS=>This is 75
RECV: This is 73
RECV: This is 75
WS=>This is 76
WS=>This is 77
RECV: This is 74
RECV: This is 77
WS=>This is 78
WS=>This is 79
RECV: This is 76
RECV: This is 79
WS=>This is 80
WS=>This is 81
RECV: This is 78
RECV: This is 81
WS=>This is 82
WS=>This is 83
WS=>This is 84
WS=>This is 85
RECV: This is 80
RECV: This is 83
RECV: This is 82
RECV: This is 84
RECV: This is 85
WS=>This is 86
WS=>This is 87
WS=>This is 88
RECV: This is 86
RECV: This is 88
RECV: This is 87
WS=>This is 89
WS=>This is 90
WS=>This is 91
RECV: This is 89
RECV: This is 91
WS=>This is 92
WS=>This is 93
RECV: This is 90
RECV: This is 93
WS=>This is 94
WS=>This is 95
RECV: This is 92
RECV: This is 95
WS=>This is 96
WS=>This is 97
WS=>This is 98
RECV: This is 94
RECV: This is 98
RECV: This is 96
WS=>This is 99
RECV: This is 97
RECV: This is 99
```

これが Concurrent::Promises.future の動きだ。罠多い。
WebSocketのコールバックは順序どおりに受け取っているが、たかだかputsするだけの処理でもFuture化することで順序が入れ替わっている
