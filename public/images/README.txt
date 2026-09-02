这个文件夹用于存放项目截图。

使用步骤：
1. 把你的截图复制到这里，建议命名如：
   - project-arboard.png（应收看板）
   - project-kingdee.png（金蝶云 API）
   - project-rag-agent.png（RAG Agent 录屏截图）
   - project-bank-competition.png（刷题记录）
2. 打开 src/data/content.js，把对应项目的 imageSrc 从空字符串改为：
   "images/project-arboard.png"（以此类推）
3. 刷新页面即可看到真实图片。

注意：本文件夹内的文件会随 dist 一起发布，请勿放入敏感信息。
