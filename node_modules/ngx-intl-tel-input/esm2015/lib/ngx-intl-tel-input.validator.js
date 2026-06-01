/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as lpn from 'google-libphonenumber';
/** @type {?} */
export const phoneNumberValidator = (/**
 * @param {?} control
 * @return {?}
 */
(control) => {
    /** @type {?} */
    const isCheckValidation = document.getElementById('phone').getAttribute('validation');
    if (isCheckValidation == 'true') {
        /** @type {?} */
        const isRequired = control.errors && control.errors.required === true;
        /** @type {?} */
        const error = { validatePhoneNumber: { valid: false } };
        /** @type {?} */
        let number;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWludGwtdGVsLWlucHV0LnZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1pbnRsLXRlbC1pbnB1dC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtaW50bC10ZWwtaW5wdXQudmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEtBQUssR0FBRyxNQUFNLHVCQUF1QixDQUFDOztBQUU3QyxNQUFNLE9BQU8sb0JBQW9COzs7O0FBQUcsQ0FBQyxPQUFvQixFQUFFLEVBQUU7O1VBQ3RELGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztJQUNyRixJQUFJLGlCQUFpQixJQUFJLE1BQU0sRUFBRTs7Y0FDMUIsVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssSUFBSTs7Y0FDL0QsS0FBSyxHQUFHLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7O1lBQ25ELE1BQXVCO1FBRTNCLElBQUk7WUFDSCxNQUFNLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNsRztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1gsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO2dCQUFFLE9BQU8sS0FBSyxDQUFDO2FBQUU7U0FDMUM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDbEIsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWixPQUFPLEtBQUssQ0FBQzthQUNiO2lCQUFNO2dCQUNOLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUNqRyxPQUFPLEtBQUssQ0FBQztpQkFDYjthQUNEO1NBQ0Q7S0FDRDtTQUFNLElBQUcsaUJBQWlCLElBQUksT0FBTyxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUMxQjtJQUNELE9BQU87QUFFUixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAqIGFzIGxwbiBmcm9tICdnb29nbGUtbGlicGhvbmVudW1iZXInO1xuXG5leHBvcnQgY29uc3QgcGhvbmVOdW1iZXJWYWxpZGF0b3IgPSAoY29udHJvbDogRm9ybUNvbnRyb2wpID0+IHtcblx0Y29uc3QgaXNDaGVja1ZhbGlkYXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGhvbmUnKS5nZXRBdHRyaWJ1dGUoJ3ZhbGlkYXRpb24nKTtcblx0aWYgKGlzQ2hlY2tWYWxpZGF0aW9uID09ICd0cnVlJykge1xuXHRcdGNvbnN0IGlzUmVxdWlyZWQgPSBjb250cm9sLmVycm9ycyAmJiBjb250cm9sLmVycm9ycy5yZXF1aXJlZCA9PT0gdHJ1ZTtcblx0XHRjb25zdCBlcnJvciA9IHsgdmFsaWRhdGVQaG9uZU51bWJlcjogeyB2YWxpZDogZmFsc2UgfSB9O1xuXHRcdGxldCBudW1iZXI6IGxwbi5QaG9uZU51bWJlcjtcblxuXHRcdHRyeSB7XG5cdFx0XHRudW1iZXIgPSBscG4uUGhvbmVOdW1iZXJVdGlsLmdldEluc3RhbmNlKCkucGFyc2UoY29udHJvbC52YWx1ZS5udW1iZXIsIGNvbnRyb2wudmFsdWUuY291bnRyeUNvZGUpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGlmIChpc1JlcXVpcmVkID09PSB0cnVlKSB7IHJldHVybiBlcnJvcjsgfVxuXHRcdH1cblxuXHRcdGlmIChjb250cm9sLnZhbHVlKSB7XG5cdFx0XHRpZiAoIW51bWJlcikge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIWxwbi5QaG9uZU51bWJlclV0aWwuZ2V0SW5zdGFuY2UoKS5pc1ZhbGlkTnVtYmVyRm9yUmVnaW9uKG51bWJlciwgY29udHJvbC52YWx1ZS5jb3VudHJ5Q29kZSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZihpc0NoZWNrVmFsaWRhdGlvbiA9PSAnZmFsc2UnKSB7XG5cdFx0Y29udHJvbC5jbGVhclZhbGlkYXRvcnMoKTtcblx0fVxuXHRyZXR1cm47XG5cbn07XG4iXX0=