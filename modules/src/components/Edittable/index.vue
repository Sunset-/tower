<template>
    <div class="xui-edittable xui-edittable-style xui-datatable xui-datatable-style xui-datapage xui-datapage-style">
        <table class="xui-datatable-table table table-bordered table-striped">
            <thead>
                <tr>
                    <th class="text-center" style="width:60px;" v-if="options.showNumber!==false">序号</th>
                    <th class="text-center" v-for="(col,index) in options.cols" :style="col.colStyle" :key="index">{{col.title}}</th>
                    <th class="text-center" v-if="validateConfig" :style="validateConfig&&validateConfig.colStyle">{{validateConfig.title}}</th>
                    <th class="text-center" v-if="options.removeable!==false">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record,index) in records" :key="index">
                    <td class="text-center" v-if="options.showNumber!==false">{{index+1}}</td>
                    <td :class="['text-center widget-td',col.validate?col.validate(record[col.name],record,records,model)?'':'invalid':'']"
                        v-for="(col,cindex) in options.cols" :key="cindex" style="vertical-align: middle;">
                        <span v-if="!col.widget">{{record[col.name]}}</span>
                        <component ref="fields" v-if="col.widget" :is="'xui-'+col.widget" :options="copy(col)"
                            v-model="record[col.name]"></component>
                    </td>
                    <td :class="['text-center widget-td']" v-if="validateConfig">
                        <span v-html="validateConfig&&validateConfig.error&&validateConfig.error(record,records,model)"></span>
                    </td>
                    <td class="text-center" v-if="options.removeable!==false">
                        <xui-button color="danger" size="small" @click="removeRecord(record)">删除</xui-button>
                    </td>
                </tr>
                <tr v-if="options.add!==false">
                    <td class="text-center" :colspan="options.cols.length+2+(validateConfig?1:0)">
                        <xui-button color="primary" size="small" @click="addRecord">添加</xui-button>
                    </td>
                </tr>
            </tbody>
            <tfoot></tfoot>
        </table>
    </div>
</template>
<script>
export default {
    props: {
        options: {
            type: Object,
        },
        value: {},
        model : {}
    },
    data() {
        return {
            records: [],
        };
    },
    computed: {
        validateConfig(){
            return this.options.showValidate;
        }
    },
    methods: {
        addRecord() {
            var record = {};
            if (Sunset.isFunction(this.options.addTemplate)) {
                record = this.options.addTemplate(record);
            }
            this.options.cols.forEach((c) => {
                if (record[c.name] === void 0) {
                    Vue.set(record, c.name, "");
                }
            });
            this.records.push(record);
        },
        removeRecord(item) {
            this.records.splice(this.records.indexOf(item), 1);
        },
        copy(col) {
            return Object.assign({}, col);
        },
    },
    ready() {
        this.records = this.value || [];
    },
    watch: {
        records: {
            handler(newValue, oldValue) {
                this.$emit("input", JSON.stringify(newValue));
            },
            deep: true,
            immediate: true,
        },
        value(v) {
            if (v) {
                try {
                    this.records = JSON.parse(v);
                } catch (e) {
                    this.records = [];
                }
            } else {
                this.records = [];
            }
        },
    },
    mounted() {
        var colSize = this.options.cols.length;
        this.options.cols.forEach((c, colIndex) => {
            if (c.watch) {
                var watchs, rebuild;
                if (Sunset.isArray(c.watch)) {
                    if (
                        Sunset.isString(c.watch[0]) &&
                        Sunset.isFunction(c.watch[1])
                    ) {
                        watchs = c.watch[0];
                        rebuild = c.watch[1];
                    }
                }
                if (watchs && rebuild) {
                    watchs.split(",").forEach((w) => {
                        this.$watch(`records`, (records) => {
                            var $fields = this.$refs.fields;
                            records &&
                                records.forEach((item, index) => {
                                    var $f =
                                        $fields[index * colSize + colIndex];
                                    Promise.resolve(
                                        rebuild($f.options, item)
                                    ).then(() => {
                                        $f.init && $f.init();
                                    });
                                });
                        });
                    });
                }
            }
        });
    },
};
</script>
<style lang="less">
.xui-edittable {
    .widget-td {
        &.invalid {
            background: rgba(red, 0.3);
        }
    }
}
</style>