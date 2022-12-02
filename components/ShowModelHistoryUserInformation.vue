<script lang="ts">
import { defineComponent, h, onMounted, ref } from "vue";
import Modal from "@/custom/components/model/Modal.vue";
import DataHistoryService from "@/custom/services/DataHistoryService";
import { DEFAULT_COLS } from "@/custom/helpers/RenderFunctionHelpers";
import Card from "@/custom/components/Card.vue";
import Spinner from "@/custom/components/Spinner.vue";
import { VueInstanceService } from "@/Defaults";
import TablePagination from "@/custom/components/table/TablePagination.vue";
import { fullNameGenerator } from "@/custom/helpers/UserHelpers";
import { gregorianIOSToPersianDate } from "@/custom/components/DateUtils";

export default defineComponent({
  setup(props, context) {
    let modalInstance: any = null;
    let tableName = "";
    const data: any = ref([]);
    const promise: any = ref();
    const page: any = ref(1);
    const totalCount: any = ref(0);

    const open = (requestedTableName) => {
      if (tableName != requestedTableName) {
        page.value = 1;
        promise.value = null;
      }
      tableName = requestedTableName;
      modalInstance.open();
    };

    const getPaginatedData = (tableName, page) => {
      return DataHistoryService.getPaginatedUserInformation(tableName, page);
    };

    context.expose({
      open,
    });

    onMounted(() => {
      // only when modal is open we will send
      // request
      VueInstanceService.on("open.bs.modal", (e) => {
        if (e.modalId == modalInstance.modalId) {
          promise.value = getPaginatedData(tableName, page.value);
          promise.value.then(({ data: info }) => {
            // console.log(info);
            data.value = info.results;
            totalCount.value = info.count;
          });
        }
      });
    });

    return () => {
      return h(
        Modal,
        {
          modalSizeClass: "w-1000px mw-1000px",
          modalTitle: "اطلاعات کاربران تغییر دهند",
          ref: (el) => (modalInstance = el),
          thinFooter: true,
        },
        {
          "modal-content": () =>
            h(
              Spinner,
              {
                promise: promise.value,
              },
              [
                DEFAULT_COLS.row({}, [
                  ...data.value.map((commitInfo) => {
                    return DEFAULT_COLS.col3(
                      h(
                        Card,
                        {
                          bodyPaddingClass: "p-1 ps-2",
                          footerPaddingClass: "p-1",
                          onClick: () => {
                            VueInstanceService.emit(
                              "show-history-info",
                              commitInfo.id
                            );
                          },
                        },
                        {
                          "card-content": () => [
                            h(
                              "p",
                              { class: "my-1" },
                              "کاربر : " + fullNameGenerator(commitInfo.user)
                            ),
                            h(
                              "p",
                              { class: "my-1" },
                              "عملیات : " +
                                (commitInfo.action == "added"
                                  ? "اضافه کردن"
                                  : commitInfo.action == "deleted"
                                  ? "حذف کردن"
                                  : "ویرایش")
                            ),
                          ],
                          "card-footer": () => [
                            h(
                              "p",
                              { class: "text-center p-1 m-0" },
                              gregorianIOSToPersianDate(
                                commitInfo.date_created,
                                true
                              )
                            ),
                          ],
                        }
                      )
                    );
                  }),
                  DEFAULT_COLS.col12(
                    h(TablePagination, {
                      count: totalCount.value,
                    })
                  ),
                ]),
              ]
            ),
        }
      );
    };
  },
});
</script>
