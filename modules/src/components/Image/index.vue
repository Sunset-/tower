<template>
    <div class="xui-image xui-image-style">
        <xui-file :options="uploadOptions"  @success="uploadSuccess"></xui-file>
    </div>
</template>
<script>
export default {
    data(){
        return {
uploadOptions: {
                label: "上传",
                size: "mini",
                color: "primary",
                multiple: true,
                directory: false,
                disabled: false,
                method: "post",
                filename: "file",
                thumbnail: true,
                wait: false,
                max: 10,
                drop: true,
                url: "/api/file/upload",
                className: "my-uploader-trigger",
                orders : [],
                filter(f) {
                    return true;
                },
                headers: {},
                formData: (ctx) => {
                    return {
                        customerId: this.currentModel.id,
                        customerName: this.currentModel.name,
                        category: ctx.category,
                    };
                },
                progress(v) {
                    console.log(v);
                },
            }
        }
    }
}
</script>