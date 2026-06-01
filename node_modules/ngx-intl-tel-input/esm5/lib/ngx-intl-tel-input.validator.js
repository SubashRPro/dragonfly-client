/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as lpn from 'google-libphonenumber';
/** @type {?} */
export var phoneNumberValidator = (/**
 * @param {?} control
 * @return {?}
 */
function (control) {
    /** @type {?} */
    var isCheckValidation = document.getElementById('phone').getAttribute('validation');
    if (isCheckValidation == 'true') {
        /** @type {?} */
        var isRequired = control.errors && control.errors.required === true;
        /** @type {?} */
        var error = { validatePhoneNumber: { valid: false } };
        /** @type {?} */
        var number = void 0;
        try {
            number = lpn.PhoneNumberUtil.getInstance().parse(control.value.number, control.value.countryCode);
        }
        catch (e) {
            if (isRequired === true) {
                return error;
            }
        }
        if (control.value) {
            if (!number) {
                return error;
            }
            else {
                if (!lpn.PhoneNumberUtil.getInstance().isValidNumberForRegion(number, control.value.countryCode)) {
                    return error;
                }
            }
        }
    }
    else if (isCheckValidation == 'false') {
        control.clearValidators();
    }
    return;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWludGwtdGVsLWlucHV0LnZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1pbnRsLXRlbC1pbnB1dC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtaW50bC10ZWwtaW5wdXQudmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEtBQUssR0FBRyxNQUFNLHVCQUF1QixDQUFDOztBQUU3QyxNQUFNLEtBQU8sb0JBQW9COzs7O0FBQUcsVUFBQyxPQUFvQjs7UUFDbEQsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO0lBQ3JGLElBQUksaUJBQWlCLElBQUksTUFBTSxFQUFFOztZQUMxQixVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxJQUFJOztZQUMvRCxLQUFLLEdBQUcsRUFBRSxtQkFBbUIsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTs7WUFDbkQsTUFBTSxTQUFpQjtRQUUzQixJQUFJO1lBQ0gsTUFBTSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDbEc7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNYLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtnQkFBRSxPQUFPLEtBQUssQ0FBQzthQUFFO1NBQzFDO1FBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1osT0FBTyxLQUFLLENBQUM7YUFDYjtpQkFBTTtnQkFDTixJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDakcsT0FBTyxLQUFLLENBQUM7aUJBQ2I7YUFDRDtTQUNEO0tBQ0Q7U0FBTSxJQUFHLGlCQUFpQixJQUFJLE9BQU8sRUFBRTtRQUN2QyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDMUI7SUFDRCxPQUFPO0FBRVIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgKiBhcyBscG4gZnJvbSAnZ29vZ2xlLWxpYnBob25lbnVtYmVyJztcblxuZXhwb3J0IGNvbnN0IHBob25lTnVtYmVyVmFsaWRhdG9yID0gKGNvbnRyb2w6IEZvcm1Db250cm9sKSA9PiB7XG5cdGNvbnN0IGlzQ2hlY2tWYWxpZGF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bob25lJykuZ2V0QXR0cmlidXRlKCd2YWxpZGF0aW9uJyk7XG5cdGlmIChpc0NoZWNrVmFsaWRhdGlvbiA9PSAndHJ1ZScpIHtcblx0XHRjb25zdCBpc1JlcXVpcmVkID0gY29udHJvbC5lcnJvcnMgJiYgY29udHJvbC5lcnJvcnMucmVxdWlyZWQgPT09IHRydWU7XG5cdFx0Y29uc3QgZXJyb3IgPSB7IHZhbGlkYXRlUGhvbmVOdW1iZXI6IHsgdmFsaWQ6IGZhbHNlIH0gfTtcblx0XHRsZXQgbnVtYmVyOiBscG4uUGhvbmVOdW1iZXI7XG5cblx0XHR0cnkge1xuXHRcdFx0bnVtYmVyID0gbHBuLlBob25lTnVtYmVyVXRpbC5nZXRJbnN0YW5jZSgpLnBhcnNlKGNvbnRyb2wudmFsdWUubnVtYmVyLCBjb250cm9sLnZhbHVlLmNvdW50cnlDb2RlKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRpZiAoaXNSZXF1aXJlZCA9PT0gdHJ1ZSkgeyByZXR1cm4gZXJyb3I7IH1cblx0XHR9XG5cblx0XHRpZiAoY29udHJvbC52YWx1ZSkge1xuXHRcdFx0aWYgKCFudW1iZXIpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFscG4uUGhvbmVOdW1iZXJVdGlsLmdldEluc3RhbmNlKCkuaXNWYWxpZE51bWJlckZvclJlZ2lvbihudW1iZXIsIGNvbnRyb2wudmFsdWUuY291bnRyeUNvZGUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYoaXNDaGVja1ZhbGlkYXRpb24gPT0gJ2ZhbHNlJykge1xuXHRcdGNvbnRyb2wuY2xlYXJWYWxpZGF0b3JzKCk7XG5cdH1cblx0cmV0dXJuO1xuXG59O1xuIl19