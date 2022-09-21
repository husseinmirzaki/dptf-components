<script lang="ts">
import {defineComponent, h, onMounted, ref} from "vue";
import Modal from "@/custom/components/model/Modal.vue";
import {VueInstanceService} from "@/Defaults";
import CounterCardV1 from "@/custom/components/utils/CounterCardV1.vue";
import {DEFAULT_COLS} from "@/custom/helpers/RenderFunctionHelpers";
import DataHistoryService from "@/custom/services/DataHistoryService";
import Spinner from "@/custom/components/Spinner.vue";
import ShowModelHistoryUserInformation from "@/custom/components/ShowModelHistoryUserInformation.vue";
import ShowModelHistoryInfo from "@/custom/components/ShowModelHistoryInfo.vue";

export default defineComponent({
  setup(props, context) {

    let modalInstance: any = null;
    let userInformationModalInstance: any = null;
    let tableName = '';
    const data: any = ref({
      user_count: 0,
      deleted_count: 0,
      changes_count: 0,
      added_count: 0,
    })
    const promise: any = ref();


    const open = () => {
      modalInstance.open();
    }

    const getTableBasicHistory = (tableName) => {
      return DataHistoryService.getBasicTableHistory(tableName);
    }

    onMounted(() => {
      VueInstanceService.on('show-history', (e) => {
        const command: string = e[0];

        switch (command) {
          case "open":
            tableName = e[1];
            promise.value = getTableBasicHistory(tableName);
            promise.value.then(({data: info}) => data.value = info);
            open();
            break;
        }
      });
      // VueInstanceService.on('opened.bs.modal', (e) => {
      //   if (e['modalId'] == modalInstance.modalId) {
      //     promise.value = getTableBasicHistory(tableName);
      //   }
      // });
    });

    return () => {

      const overallInformationModal = h(Modal, {
        modalSizeClass: 'w-1000px mw-1000px',
        modalTitle: "تاریخچه جدول",
        modalDescription: "اطلاعات اولیه ای درمورد اضافه شده، ویرایش شده، حذف شده ارائه میدهد",
        thinFooter: true,
        ref: (el) => modalInstance = el,
      }, {
        'modal-content': (e) => {
          if (['opened', 'open', 'close'].indexOf(e.state) > -1) {
            const changeCounter = [
              DEFAULT_COLS.col3(
                  h(Spinner, {
                    promise: promise.value,
                  }, {
                    default: () => h(CounterCardV1, {
                      title: "تغییر دهندگان",
                      extra: data.value.user_count,
                      onClick: () => {
                        userInformationModalInstance.open(tableName);
                      }
                    })
                  })
              ),
              DEFAULT_COLS.col3(
                  h(Spinner, {
                    promise: promise.value,
                  }, {
                    default: () => h(CounterCardV1, {
                      title: "تعداد اضافه کردن ها",
                      extra: data.value.added_count,
                      onClick: () => {
                        //
                      }
                    })
                  })
              ),
              DEFAULT_COLS.col3(
                  h(Spinner, {
                    promise: promise.value,
                  }, {
                    default: () => h(CounterCardV1, {
                      title: "تعداد ویرایش کردن ها",
                      extra: data.value.changes_count,
                      onClick: () => {
                        //
                      }
                    })
                  })
              ),
              DEFAULT_COLS.col3(
                  h(Spinner, {
                    promise: promise.value,
                  }, {
                    default: () => h(CounterCardV1, {
                      title: "تعداد حذف کردن ها",
                      extra: data.value.deleted_count,
                      onClick: () => {
                        //
                      }
                    })
                  })
              ),
            ];
            return h(
                'div',
                {
                  class: 'row'
                },
                changeCounter
            );


          }
        }
      });

      const historyUserInformationModal = h(ShowModelHistoryUserInformation, {
        ref: (el) => userInformationModalInstance = el,
      });

      const showHistoryInformation = h(ShowModelHistoryInfo);


      return [
        overallInformationModal,
        historyUserInformationModal,
        showHistoryInformation,
      ];
    }
  }
});
</script>