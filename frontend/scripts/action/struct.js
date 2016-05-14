/**
 * Created by kelvinsun on 2016/5/4.
 */

define({
    init: (data) => ({
        type: 'STRUCT_INIT',
        data,
    }),
    create: ({ outlineId, name }) => ({
        type: 'STRUCT_CREATE',
        data: { outlineId, name, },
    }),
    rename: ({ outlineId, categoryId, name }) => ({
        type: 'STRUCT_RENAME',
        data: { outlineId, categoryId, name },
    }),
    delete ({ outlineId, categoryId }) {
        return {
            type: 'STRUCT_DELETE',
            data: { outlineId, categoryId, },
        };
    },
    move ({ originId, targetId, categoryId, }) {
        return {
            type: 'STRUCT_MOVE',
            data: { originId, targetId, categoryId, },
        };
    }
});