# tldraw를 따로 관리하는 이유?
- 현재 tldraw는 많은 whiteboard 라이브러리 중에서 custom이 그나마 되는 편
- 그럼에도 불구하고 private method들로 인해 어쩔 수 없이 custom이 불가능한 경우가 존재함
- 따라서 소스 코드 단에서 커스텀해야함

# 작업 순서
```angular2html
1. 세팅
  a. git clone https://github.com/toonsquare/tldraw.git
  b. cd tldraw
  c. yarn 없으면 먼저 설치
  d. corepack enable
  e. yarn
2. 소스 코드 수정
3. toonsquare/tldraw에 수정사항 PR 및 머지
4. 최상단 디렉토리로 이동
5. yarn build
6. 수정한 코드가 포함된 패키지 디렉토리 내에서 아래 진행
  a. package.json 내의 "pack-tarball" 스크립트 실행
  b. 실행 결과로 나온 package.tgz 의 압축을 풀어서 내부 파일들을 toonsquare-monorepo/packages 내로 이동
  c. 해당 파일들 중 package.json 내의 일부 패키지 버전을 workspace:*로 수정 및 scripts 내에 "build" 삭제
    가. 패키지 버전은 3가지를 수정해야함. tldraw, @tldraw/editor, @tldraw/store
7. toonsquare-monorepo에 PR 및 머지
```

# 버전 규칙
- 버전은 항상 tldraw의 릴리즈 버전을 따라감
- tldraw의 realease를 항상 바탕으로 'v3.2.2-custom0'과 같은 브랜치명을 메인으로 잡음

***
# tldraw

Welcome to the public monorepo for [tldraw](https://github.com/tldraw/tldraw). tldraw is a library for creating infinite canvas experiences in React. It's the software behind the digital whiteboard [tldraw.com](https://tldraw.com).

- Read the docs and learn more at [tldraw.dev](https://tldraw.dev).
- Learn about [our license](https://github.com/tldraw/tldraw#License).

> 🤵 Interested in using tldraw in your product? [Click here](https://tldraw.dev/#pricing) to learn about our license and pricing.

## Installation

```bash
npm i tldraw
```

## Usage

```tsx
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

export default function App() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw />
		</div>
	)
}
```

Learn more at [tldraw.dev](https://tldraw.dev).

## Local development

The local development server will run our examples app. The basic example will show any changes you've made to the codebase.

To run the local development server, first clone this repo.

Enable [corepack](https://nodejs.org/api/corepack.html) to make sure you have the right version of `yarn`:

```bash
corepack enable
```

Install dependencies:

```bash
yarn
```

Start the local development server:

```bash
yarn dev
```

Open the example project at `localhost:5420`.

## License

The tldraw SDK is provided under the [tldraw license](https://github.com/tldraw/tldraw/blob/main/LICENSE.md).

You can use the tldraw SDK in commercial or non-commercial projects so long as you preserve the "Made with tldraw" watermark on the canvas. To remove the watermark, you can purchase a [business license](https://tldraw.dev/#pricing). Visit [tldraw.dev](https://tldraw.dev) to learn more.

## Trademarks

Copyright (c) 2024-present tldraw Inc. The tldraw name and logo are trademarks of tldraw. Please see our [trademark guidelines](https://github.com/tldraw/tldraw/blob/main/TRADEMARKS.md) for info on acceptable usage.

## Distributions

You can find tldraw on npm [here](https://www.npmjs.com/package/@tldraw/tldraw?activeTab=versions).

## Contribution

Please see our [contributing guide](https://github.com/tldraw/tldraw/blob/main/CONTRIBUTING.md). Found a bug? Please [submit an issue](https://github.com/tldraw/tldraw/issues/new).

## Community

Have questions, comments or feedback? [Join our discord](https://discord.gg/rhsyWMUJxd) or [start a discussion](https://github.com/tldraw/tldraw/discussions/new). For the latest news and release notes, visit [tldraw.dev](https://tldraw.dev).

## Contributors

<a href="https://github.com/tldraw/tldraw/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=tldraw/tldraw&max=400&columns=20" width="100%"/>
</a>

## Star History

<a href="https://star-history.com/#tldraw/tldraw">
	<picture>
	  <source
	    media="(prefers-color-scheme: dark)"
	    srcset="https://api.star-history.com/svg?repos=tldraw/tldraw&type=Date&theme=dark"
	  />
	  <source
	    media="(prefers-color-scheme: light)"
	    srcset="https://api.star-history.com/svg?repos=tldraw/tldraw&type=Date"
	  />
	  <img src="https://api.star-history.com/svg?repos=tldraw/tldraw&type=Date" alt="Star History Chart" width="100%" />
	</picture>
</a>

## Contact

Find us on Twitter/X at [@tldraw](https://twitter.com/tldraw). You can contact us at by email at [hello@tldraw.com](mailto:hello@tldraw.com).
