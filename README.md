# Concurrent::Promises.futureを使うと、WebSocketコールバック順序がぐちゃぐちゃになる問題の再現

```
node server.js
```

でlocalhost:5001にWebSocketサーバーを建てる。

client.rbで、sync=trueのときは、何度やってもきれいに

```
 $ bundle exec ruby client.rb
RECV: This is 0
RECV: This is 1
RECV: This is 2
RECV: This is 3
RECV: This is 4
RECV: This is 5
RECV: This is 6
RECV: This is 7
RECV: This is 8
RECV: This is 9
RECV: This is 10
RECV: This is 11
RECV: This is 12
RECV: This is 13
RECV: This is 14
RECV: This is 15
　(中略)
RECV: This is 94
RECV: This is 95
RECV: This is 96
RECV: This is 97
RECV: This is 98
RECV: This is 99
```

sync=falseにすると？？

```
$ bundle exec ruby client.rb
RECV: This is 0
RECV: This is 3
RECV: This is 4
RECV: This is 86
RECV: This is 6
RECV: This is 5
RECV: This is 7
RECV: This is 9
RECV: This is 10
RECV: This is 11
RECV: This is 12
RECV: This is 13
RECV: This is 14
RECV: This is 15
RECV: This is 16
RECV: This is 17
RECV: This is 18
　（中略）
RECV: This is 84
RECV: This is 85
RECV: This is 1
RECV: This is 2
RECV: This is 87
RECV: This is 88
RECV: This is 89
RECV: This is 90
RECV: This is 91
RECV: This is 92
RECV: This is 93
RECV: This is 94
RECV: This is 95
RECV: This is 96
RECV: This is 97
RECV: This is 98
RECV: This is 99
RECV: This is 8
```

これが Concurrent::Promises.future の動きだ。罠多い。
