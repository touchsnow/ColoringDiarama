import SdkTools, { Game_Platform } from "../../tools/SdkTools"
import NavigateController from "../../navigate/NavigateController"
import BlockQQ from "./BlockQQ";
import BlockTest from "./BlockTest";
import BlockWX from "./BlockWX";

import { _decorator } from "cc";

class BlockController {
    private static instance: BlockController

    /**
     * 积木广告ID
     */
    public ID_BlockID = "";

    /**
     * BlockController 单例
     */
    public static getInstance(): BlockController {
        if (!BlockController.instance) {
            BlockController.instance = new BlockController()
        }
        return BlockController.instance
    }


    /**
     * 创建积木广告
     */
    public createBlock() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NavigateController.getInstance().createNavigateBoxBanner(this.ID_BlockID);
                return;
            case Game_Platform.GP_QQ:
                BlockQQ.getInstance().createBlock(this.ID_BlockID);
                return;
            case Game_Platform.GP_WX:
                BlockWX.getInstance().createBlock(this.ID_BlockID);
                return
            default:
                break;
        }
    }

    /**
     * 获取积木是否可以展示标志
     */
    public getBlockFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                return BlockQQ.getInstance().getBlockFlag();
            case Game_Platform.GP_WX:
                return BlockWX.getInstance().getBlockFlag();
            case Game_Platform.GP_Test:
                return true;
        }
    }

    /**
     * 展示积木广告
     */
    public showBlock(type: string, x: number, y: number, blockSize: number) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                BlockQQ.getInstance().showBlock(type, x, y, blockSize);
                return;
            case Game_Platform.GP_WX:
                BlockWX.getInstance().showBlock(type, x, y, blockSize);
                return;
            case Game_Platform.GP_Test:
                BlockTest.getInstance().showBlock(type, x, y, blockSize);
                return;
        }
    }

    /**
     * 关闭积木广告
     */
    public hideBlock() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                BlockTest.getInstance().hideBlock();
                return;
            case Game_Platform.GP_QQ:
                BlockQQ.getInstance().hideBlock();
                return;
            case Game_Platform.GP_WX:
                BlockWX.getInstance().hideBlock();
                return;
            default:
                break;
        }
    }

}
export default BlockController