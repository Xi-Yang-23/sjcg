# 安装文档编辑器
- 进入**ckeditor5文件夹**执行`cnpm i`
- `npm run build` 打包编辑器 
 

# start
```sh
cnpm i
```

# 把本地编辑器加入项目
- 若项目中的`package.json`有`ckeditor5-build`就删除，没有不做任何操作
```sh
ckeditor5-build
```
```sh
cnpm i ./ckeditor5
```

# 运行
```sh
npm run dev
```

# 打包
```sh
npm run build
```

#　注意
如果重新运行项目时，记得把**package.json里的ckeditor5-build**删除，然后再执行以上步骤。

