/**
 * Created by kelvinsun on 2016/5/4.
 */

define({
    init: (data) => ({
        type: 'STRUCT_INIT',
        data,
    }),
    rename: ({ outlineId, categoryId, name }) => ({
        type: 'STRUCT_RENAME',
        data: { outlineId, categoryId, name },
    }),
});