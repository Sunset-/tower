<template>
    <div>
        <xui-scroll style="height:550px;">
            <table class="calculate-result-table" style="margin:15px;" v-show="result.product&&result.calculateStrategy==0">
                <colgroup>
                    <col width="80">
                    <col width="110">
                    <col width="110">
                    <col width="110">
                    <col width="110">
                    <col width="30">
                    <col width="110">
                    <col width="110">
                    <col width="110">
                    <col width="110">
                </colgroup>
                <!-- title -->
                <tbody>
                    <tr>
                        <td align="center" style="height:30px;font-size:16px;font-weight:bold;line-height:30px;" colspan="10">{{product.id?`${customer.name}_${product.name}_损失计算`:''}}</td>
                    </tr>
                    <tr>
                        <td align="center" colspan="2">实施日</td>
                        <td align="center" colspan="2">揭露日</td>
                        <td align="center" colspan="2">基准日</td>
                        <td align="center" colspan="2">基准价</td>
                        <td align="center" colspan="2">实施日库存</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2">{{product.implementationDate}}</td>
                        <td align="right" colspan="2">{{product.disclosureDate}}</td>
                        <td align="right" colspan="2">{{product.baseDate}}</td>
                        <td align="right" colspan="2">{{product.basePrice}}</td>
                        <td align="right" colspan="2">{{order.implementationDateStock}}</td>
                    </tr>
                    <tr>
                        <td colspan="10"></td>
                    </tr>
                    <tr>
                        <td align="center">期间</td>
                        <td align="center">买入时间</td>
                        <td align="center">买入价格</td>
                        <td align="center">买入数量</td>
                        <td align="center">成交金额</td>
                        <td align="center"></td>
                        <td align="center">卖出时间</td>
                        <td align="center">卖出价格</td>
                        <td align="center">卖出数量</td>
                        <td align="center">成交金额</td>
                    </tr>
                    <!-- before -->
                    <tr v-for="(a,i) in beforeRows" :key="'before-'+i">
                        <td v-if="i==0" :rowspan="beforeRows+2">实施日至揭露日</td>
                        <td align="right">{{beforeBuys[i]?`${beforeBuys[i].transactionDate}`:''}}</td>
                        <td align="right">{{beforeBuys[i]?`${money(beforeBuys[i].dealPrice,2)}`:''}}</td>
                        <td align="right">{{beforeBuys[i]?`${money(beforeBuys[i].dealQuantity,0)}`:''}}</td>
                        <td align="right">{{beforeBuys[i]?`${money(beforeBuys[i].dealAmount,2)}`:''}}</td>
                        <td v-if="i==0" :rowspan="beforeRows+2"></td>
                        <td align="right" class="color-danger" v-if="i<beforeSaleStock.length">{{beforeSaleStock[i]?`${beforeSaleStock[i].transactionDate}`:''}}</td>
                        <td align="right" class="color-danger" v-if="i<beforeSaleStock.length">{{beforeSaleStock[i]?`${money(beforeSaleStock[i].dealPrice,2)}`:''}}</td>
                        <td align="right" class="color-danger" v-if="i<beforeSaleStock.length">{{beforeSaleStock[i]?`${money(beforeSaleStock[i].dealQuantity,0)}`:''}}</td>
                        <td align="right" class="color-danger" v-if="i<beforeSaleStock.length">{{beforeSaleStock[i]?`${money(beforeSaleStock[i].dealAmount,2)}`:''}}</td>
                        <td align="right" v-if="i>=beforeSaleStock.length">{{beforeSale[i-beforeSaleStock.length]?`${beforeSale[i-beforeSaleStock.length].transactionDate}`:''}}</td>
                        <td align="right" v-if="i>=beforeSaleStock.length">{{beforeSale[i-beforeSaleStock.length]?`${money(beforeSale[i-beforeSaleStock.length].dealPrice,2)}`:''}}</td>
                        <td align="right" v-if="i>=beforeSaleStock.length">{{beforeSale[i-beforeSaleStock.length]?`${money(beforeSale[i-beforeSaleStock.length].dealQuantity,0)}`:''}}</td>
                        <td align="right" v-if="i>=beforeSaleStock.length">{{beforeSale[i-beforeSaleStock.length]?`${money(beforeSale[i-beforeSaleStock.length].dealAmount,2)}`:''}}</td>
                    </tr>
                    <tr>
                        <td align="center">期间买入汇总</td>
                        <td align="center">期间买入均价</td>
                        <td align="center">期间买入总数量</td>
                        <td align="center">期间买入总金额</td>
                        <td align="center">期间卖出汇总</td>
                        <td align="center">期间卖出均价</td>
                        <td align="center">期间卖出总数量</td>
                        <td align="center">期间卖出总金额</td>
                    </tr>
                    <tr>
                        <td align="center"></td>
                        <td align="center">{{money(result.beforeBuyAveragePrice,6)}}</td>
                        <td align="center">{{money(result.beforeBuyNum,0)}}</td>
                        <td align="center">{{money(result.beforeBuyAmount,2)}}</td>
                        <td align="center"></td>
                        <td align="center">{{money(result.beforeSaleAveragePrice,6)}}</td>
                        <td align="center">{{money(result.beforeValidSaleNum,0)}}</td>
                        <td align="center">{{money(result.beforeSaleAmount,2)}}</td>
                    </tr>
                    <tr>
                        <td align="center" colspan="4">买入均价=（买入总金额-卖出总金额）/持有数量</td>
                        <td align="center">{{money(result.beforeBuyHoldAveragePrice,6)}}</td>
                        <td align="center" colspan="4">持有数量=买入总数量-卖出总数量</td>
                        <td align="center">{{money(result.beforeHoldNum,0)}}</td>
                    </tr>
                    <tr>
                        <td colspan="10"></td>
                    </tr>
                    <!-- after -->
                    <tr>
                        <td align="center">期间</td>
                        <td align="center"></td>
                        <td align="center"></td>
                        <td align="center"></td>
                        <td align="center"></td>
                        <td align="center"></td>
                        <td align="center">卖出时间</td>
                        <td align="center">卖出价格</td>
                        <td align="center">卖出数量</td>
                        <td align="center">成交金额</td>
                    </tr>
                    <!-- after -->
                    <tr v-for="(a,i) in afterRows" :key="'after-'+i">
                        <td v-if="i==0" :rowspan="afterRows+2">揭露日至基准日</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td v-if="i==0" :rowspan="afterRows+2"></td>
                        <td align="right" class="color-danger" v-if="i<afterSaleStock.length">{{afterSaleStock[i]?`${afterSaleStock[i].transactionDate}`:''}}</td>
                        <td align="right" class="color-danger" v-if="i<afterSaleStock.length">{{afterSaleStock[i]?`${money(afterSaleStock[i].dealPrice,2)}`:''}}</td>
                        <td align="right" class="color-danger" v-if="i<afterSaleStock.length">{{afterSaleStock[i]?`${money(afterSaleStock[i].dealQuantity,0)}`:''}}</td>
                        <td align="right" class="color-danger" v-if="i<afterSaleStock.length">{{afterSaleStock[i]?`${money(afterSaleStock[i].dealAmount,2)}`:''}}</td>
                        <td align="right" v-if="i>=afterSaleStock.length">{{afterSale[i]?`${afterSale[i].transactionDate}`:''}}</td>
                        <td align="right" v-if="i>=afterSaleStock.length">{{afterSale[i]?`${money(afterSale[i].dealPrice,2)}`:''}}</td>
                        <td align="right" v-if="i>=afterSaleStock.length">{{afterSale[i]?`${money(afterSale[i].dealQuantity,0)}`:''}}</td>
                        <td align="right" v-if="i>=afterSaleStock.length">{{afterSale[i]?`${money(afterSale[i].dealAmount,2)}`:''}}</td>
                    </tr>
                    <tr v-if="afterRows==0">
                        <td :rowspan="3">揭露日至基准日</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td :rowspan="3"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td align="center"></td>
                        <td align="center"></td>
                        <td align="center"></td>
                        <td align="center"></td>
                        <td align="center">卖出均价</td>
                        <td align="center">剩余持有</td>
                        <td align="center">卖出数量</td>
                        <td align="center">卖出总金额</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td align="center">{{money(result.afterSaleAveragePrice,6)}}</td>
                        <td align="center">{{money(result.afterHoldNum,0)}}</td>
                        <td align="center">{{money(result.afterValidSaleNum,0)}}</td>
                        <td align="center">{{money(result.afterSaleAmount,2)}}</td>
                    </tr>
                    <tr>
                        <td colspan="10"></td>
                    </tr>
                    <tr>
                        <td colspan="10"></td>
                    </tr>
                    <tr>
                        <td align="left" colspan="8">投资损失 =（买入均价 - 卖出均价）× 卖出数量+（买入均价-基准价）× 剩余持有</td>
                        <td align="right" colspan="2">{{money(result.investmentLoss,2)}}</td>
                    </tr>
                    <tr>
                        <td align="left" colspan="8">佣金=投资损失×1‰</td>
                        <td align="right" colspan="2">{{money(result.commission,2)}}</td>
                    </tr>
                    <tr>
                        <td align="left" colspan="8">印花税=投资损失×1‰</td>
                        <td align="right" colspan="2">{{money(result.stampDuty,2)}}</td>
                    </tr>
                    <tr>
                        <td align="left" colspan="8">资金利息=（投资损失+佣金+印花税）× 0.35% × {{result.interestYears}}</td>
                        <td align="right" colspan="2">{{money(result.interest,2)}}</td>
                    </tr>
                    <tr>
                        <td align="left" colspan="8">合计损失</td>
                        <td align="right" colspan="2">{{money(result.totalLoss,2)}}</td>
                    </tr>
                </tbody>
            </table>
            <table class="calculate-result-table" style="margin:15px;" v-show="result.product&&result.calculateStrategy==1">
                <colgroup>
                    <col width="120">
                    <col width="120">
                    <col width="120">
                    <col width="120">
                    <col width="120">
                    <col width="120">
                    <col width="120">
                    <col width="120">
                </colgroup>
                <!-- title -->
                <tbody>
                    <tr>
                        <td align="center" style="height:30px;font-size:16px;font-weight:bold;line-height:30px;" colspan="8">{{product.id?`${customer.name}_${product.name}_损失计算`:''}}</td>
                    </tr>
                    <tr>
                        <td align="left" colspan="8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名：{{customer.name}}</td>
                    </tr>
                    <tr>
                        <td align="left" colspan="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实施日：{{product.implementationDate}}</td>
                        <td align="left" colspan="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;揭露日：{{product.disclosureDate}}</td>
                    </tr>
                    <tr>
                        <td align="left" colspan="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;基准日：{{product.baseDate}}</td>
                        <td align="left" colspan="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;基准价：{{product.basePrice}}</td>
                    </tr>
                    <!-- <tr>
                        <td align="center" colspan="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实施日库存</td>
                        <td align="right" colspan="6">{{order.implementationDateStock}}</td>
                    </tr> -->
                    <tr>
                        <td colspan="8"></td>
                    </tr>
                    <tr>
                        <td align="center">成交日期</td>
                        <td align="center">买入股数</td>
                        <td align="center">买入金额</td>
                        <td align="center">卖出股数</td>
                        <td align="center">卖出金额</td>
                        <td align="center">成交单价</td>
                        <td align="center">股票余额</td>
                        <td align="center">买入均价</td>
                    </tr>
                    <!-- before -->
                    <tr v-for="(a,i) in beforeDetails" :key="'before-'+i">
                        <td align="right">{{`${a.transactionDate}`}}</td>
                        <td align="right">{{a.businessCategory=='买入'?`${money(a.dealQuantity,0)}`:''}}</td>
                        <td align="right">{{a.businessCategory=='买入'?`￥${money(a.dealAmount,2)}`:''}}</td>
                        <td align="right">{{a.businessCategory=='卖出'?`${money(a.dealQuantity,0)}`:''}}</td>
                        <td align="right">{{a.businessCategory=='卖出'?`￥${money(a.dealQuantity,2)}`:''}}</td>
                        <td align="right">{{`￥${money(a.dealPrice,3)}`}}</td>
                        <td align="right">{{`${money(a.detailStock,0)}`}}</td>
                        <td align="right">{{`￥${money(a.detailBuyPrice,3)}`}}</td>
                    </tr>
                    <tr>
                        <td align="center" colspan="8"></td>
                    </tr>
                    <tr>
                        <td align="center"></td>
                        <td align="center">{{result.beforeDetailBuyNum}}</td>
                        <td align="center"></td>
                        <td align="center">{{result.beforeDetailSaleNum}}</td>
                        <td align="center"></td>
                        <td align="center"></td>
                        <td align="center">{{result.beforeDetailBuyNum-result.beforeDetailSaleNum}}</td>
                        <td align="center"></td>
                    </tr>
                    <tr>
                        <td align="left" colspan="8">以下为揭露日之后的买卖情况</td>
                    </tr>
                    <!-- after -->
                    <tr v-for="(a,i) in afterDetails" :key="'after-'+i">
                        <td align="right">{{`${a.transactionDate}`}}</td>
                        <td align="right"></td>
                        <td align="right"></td>
                        <td align="right">{{a.businessCategory=='卖出'?`${money(a.dealQuantity,0)}`:''}}</td>
                        <td align="right">{{a.businessCategory=='卖出'?`￥${money(a.dealQuantity,2)}`:''}}</td>
                        <td align="right">{{`￥${money(a.dealPrice,3)}`}}</td>
                        <td align="right"></td>
                        <td align="right"></td>
                    </tr>
                    <tr>
                        <td align="left" colspan="8"></td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">揭露日前一日收盘后持有股数：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.beforeHoldNum,0)}}</td>
                        <td align="center">股</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">实施日至揭露日每股买入平均价为：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.beforeBuyHoldAveragePrice,3)}}</td>
                        <td align="center">元</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">揭露日至基准日期间卖出股数：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.beforeValidSaleNum,0)}}</td>
                        <td align="center">股</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">揭露日至基准日每股卖出平均价为：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.beforeSaleAveragePrice,3)}}</td>
                        <td align="center">元</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">基准日后仍持有股票数量为：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.afterHoldNum,0)}}</td>
                        <td align="center">股</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">投资损失差额为：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.investmentLoss,2)}}</td>
                        <td align="center">元</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">佣金=投资损失×1‰：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.commission,2)}}</td>
                        <td align="center">元</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">印花税=投资损失×1‰：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.stampDuty,2)}}</td>
                        <td align="center">元</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">资金利息=（投资损失+佣金+印花税）× 0.35% × {{result.interestYears}}：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.interest,2)}}</td>
                        <td align="center">元</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="4">合计损失：</td>
                        <td colspan="2"></td>
                        <td align="right">{{money(result.totalLoss,2)}}</td>
                        <td align="center">元</td>
                    </tr>
                </tbody>
            </table>
        </xui-scroll>
        <div slot="footer" style="padding:10px;border-top:1px solid #bdbdbd;overflow:hidden;">
            <div style="float:left;line-height:30px;font-weight:bold;font-size:14px;">合计损失：{{money(result.totalLoss,2)}}</div>
            <div style="float:left;line-height:30px;font-weight:bold;font-size:14px;margin-left:40px;">计算方法：{{product.calculateStrategy | enum('SECURITIE_CALCULATE_STRATEGY')}}</div>
            <xui-button color="success" style="float:right;" @click="exportResult">导出计算表</xui-button>
        </div>
    </div>
</template>
<script>
import Store from "./store";
const $tools = $import("dag/common/tools");
const $tip = $import("dag/common/tip");

export default {
    data() {
        return {
            result: {},
        };
    },
    computed: {
        product() {
            return this.result.product || {};
        },
        order() {
            return this.result.order || {};
        },
        customer() {
            return this.result.customer || {};
        },
        beforeBuys() {
            return this.result.beforeBuy || [];
        },
        beforeSaleStock() {
            return this.result.beforeSaleStock || [];
        },
        beforeSale() {
            return this.result.beforeSale || [];
        },
        beforeRows() {
            return Math.max(
                this.beforeBuys.length,
                this.beforeSaleStock.length + this.beforeSale.length
            );
        },
        afterSaleStock() {
            return this.result.afterSaleStock || [];
        },
        afterSale() {
            return this.result.afterSale || [];
        },
        afterRows() {
            return this.afterSaleStock.length + this.afterSale.length;
        },
        beforeDetails(){
            return this.result.beforeDetails || [];
        },
        afterDetails(){
            return this.result.afterDetails || [];
        }
    },
    methods: {
        open(orderId) {
            this.result = {};
            this.refresh(orderId);
        },
        openCalculateResult(tc) {
            this.result = tc;
        },
        refresh(orderId) {
            Store.CalculateTransaction(orderId).then((res) => {
                this.result = res;
                this.$emit("load", res);
            });
        },
        money(v, p) {
            return (+v).toFixed(p || 0);
        },
        exportResult() {
            Store.exportCalculate(
                this.order.id,
                this.result.capitalAccountGroup
            ).then((res) => {
                if (res.type == "application/json") {
                    res.text().then((t) => {
                        try {
                            var r = JSON.parse(t);
                            $tip(r.msg || "未知错误", "warning");
                        } catch (e) {
                            console.error(e);
                        }
                    });
                } else {
                    $tools.downloadFile(
                        `${this.customer.name}_${this.product.name}_损失计算.xlsx`,
                        res
                    );
                }
            });
        },
    },
};
</script>
<style lang="less">
.calculate-result-table {
    border-collapse: collapse;
    border: 1px solid #000000;
    tr {
        height: 22px;
        line-height: 22px;
    }
    td {
        border-collapse: collapse;
        border: 1px solid #000000;
        padding: 0px 3px;
    }
}
</style>