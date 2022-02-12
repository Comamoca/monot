# Monot開発者向けドキュメント

これはMonotの開発者向けドキュメントです。記事の追加、改善などはGithubのissueにお願いします。詳しくは[こちら]()

---

### [Monotのビルド](#Monotのビルド)

- [Node.jsのインストール](#Node.jsのインストール)
- [Gitのインストール](#[Gitのインストール]())
- [ソースコードの入手](#ソースコードの入手)
- [依存関係のインストール](#依存関係のインストール)
- [ビルドの実行](#ビルドの実行)
- [バイナリの実行](#バイナリの実行)
- [ホットリロード](#ホットリロード)

## Monotのビルド

#### Node.jsのインストール

- Windows

  [こちらのサイト](https://nodejs.org/ja/download/)からインストーラーをダウンロード、実行します。

- Mac

  上記のリンクからMac向けのバイナリをダウンロード、実行します。

- Linux

  ディストリビューションごとにインストール方法が違います。

  - Ubuntu

    `sudo apt update && sudo apt install nodejs npm`

  - Arch Linux

    `sudo pacman -Sy nodejs`

  - openSUSE

    `zypper install nodejs`

インストールされたか確認するにはコマンドプロンプトやShellで`    node --version`を実行します。

#### Gitのインストール

Monotはソースコードの管理にGit、ホスティングにはGithubを利用しています。

- Windows

  [こちら](http://git-scm.com/download/win)のサイトからお使いのPCに合ったインストーラーをnダウンロード

  インストールして下さい。

- Mac

   MacOSの場合、既にGitがインストールされている場合があります。`git --version`をShellで実行して、Gitがインストール済みか確認して下さい。

  もしGitがインストールされていない場合は[こちら](https://git-scm.com/download/mac)のサイトからインストーラーをダウンロード[^1]、実行して下さい。

- Linux

  各ディストリビューションのパッケージマネージャを使ってGitをインストールして下さい。

  - Ubuntu

    `sudo apt update && sudo apt install git`

  - Arch Linux

    `sudo pacman -Sy git`

  - openSUSE

    `zypper install git-core`

[^1]: インストーラーの代わりにHomebrewを使用してもインストールする事が出来ます。Homebrewがインストール済みの場合は、`$ brew update` 、` $ brew install git`を実行して下さい。Homebrewは`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`でインストール出来ます。

#### ソースコードの入手

任意のディレクトリで`git clone https://github.com/Sorakime/monot.git`を実行すると`./monot`ディレクトリが作成され、Monotのソースコードがダウンロードされます。

**以降このドキュメントではカレントディレクトリを`/monot`ディレクトリとします。**

#### 依存関係のインストール

Monotのディレクトリに移動して、`npm install`を実行すると依存関係が整理されます。

#### ビルドの実行

`npm run build`を実行すると`electron-builder`が実行され、`./dist`配下に各OSに適した実行可能ファイルが生成されます。[^2]

[^2]: Windowsなら`.exe`ファイル、MacOSなら`.app`ファイル、Linuxなら`.AppImage`ファイルが生成されます。

#### バイナリの実行

`./dist`配下に生成された実行可能ファイルをそれぞれのOSに合った方法で実行して下さい。
