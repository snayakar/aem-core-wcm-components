/*******************************************************************************
 * Copyright 2016 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Tests for the core text component
 */
;(function (h, $) {

    // shortcut
    var c = window.CQ.CoreComponentsIT.commons;

    // sample text

    // element name
    var elemName = "Luigi";
    // input label
    var label = "It is me, Mario!";
    // default value
    var defaultValue = "Uncharted";
    // help message
    var helpMessage = "Skyrim";
    // required message
    var requiredMessage = "Attack ships on fire off the shoulder of Orion";


    /**
     * Before Test Case
     */
    var tcExecuteBeforeTest = new TestCase("Setup Before Test")
        // common set up
        .execTestCase(c.tcExecuteBeforeTest)
        // create the test page, store page path in 'testPagePath'
        .execFct(function (opts,done) {
            c.createPage(c.template, c.rootPage ,'page_' + Date.now(),"testPagePath",done, 'core/wcm/sandbox/tests/components/test-page-v2')
        })
        // add the component, store component path in 'cmpPath'
        .execFct(function (opts, done){
            c.addComponent(c.rtFormText_v2, h.param("testPagePath")(opts)+c.relParentCompPath,"cmpPath",done)
        })
        // open the new page in the editor
        .navigateTo("/editor.html%testPagePath%.html");

    /**
     * After Test Case
     */
    var tcExecuteAfterTest = new TestCase("Clean up after Test")
        // common clean up
        .execTestCase(c.tcExecuteAfterTest)
        // delete the test page we created
        .execFct(function (opts, done) {
            c.deletePage(h.param("testPagePath")(opts), done);
        });

    /**
     * Helper test case: set the manadatory fields
     */
    var setMandatoryFields = new h.TestCase("Set Mandatory Fields")
        //set mandatory label text
        .fillInput("[name='./jcr:title']",label)
        // and the mandatory element name
        .fillInput("[name='./name']",elemName);

    /**
     * Helper test case: sets the input type of the form input field
     *
     * @param inputType mandatory. allowed values text,textarea, email,tel,date,number,password
     */
    var setInputType = function(inputType) {
        return new h.TestCase("Set Form Input Type to " + inputType)
            // open the dropdown
            .click("coral-select[name='./type'] button")
            // wait for the dropdown to appear
            .assert.visible("coral-select[name='./type'] coral-selectlist")
            // select the type
            .click("coral-select[name='./type'] coral-selectlist-item[value='" + inputType + "']")
    };

    /**
     * Test: Check if Label is mandatory
     */
    var checkLabelMandatory = new h.TestCase("Check Mandatory fields",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // try to close the edit dialog, NOTE: cant use tc.SaveConfigDialog as in fullscreen mode it would fail
        // since its expects a reload after clicking save
        .click(c.selSaveConfDialogButton,{expectNav:false})
        // check if the dialog is still open
        .asserts.visible(c.selConfigDialog)
        //Check if label marked as invalid
        .asserts.isTrue(function() {
            return h.find("input[name='./jcr:title'].is-invalid").size() == 1
        })
        // check if element name is marked as invalid
        .asserts.isTrue(function() {
            return h.find("input[name='./name'].is-invalid").size() == 1
        });

    /**
     * Test: Set text input label
     */
    var setLabel = new h.TestCase("Set Label",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        .execTestCase(setMandatoryFields)
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if the label is rendered
        .asserts.isTrue(function() {
            return h.find("label","#ContentFrame").text().trim() == label
        });

    var hideLabel = new h.TestCase("Hide Label",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        //Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        .execTestCase(setMandatoryFields)
        //check the hideTitle checkbox
        .click("input[type='checkbox'][name='./hideTitle'")
        //close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check that the label should not be rendered
        .asserts.isTrue(function() {
            return h.find("label", "#ContentFrame").size() == 0;
        })

        //check if the aria-label attribute has been set on the input field
        .asserts.isTrue(function() {
            return h.find("input[type='text'][name='" + elemName + "'][aria-label='" + label + "']",
                    "#ContentFrame").size() == 1;
        })

        // test it also for text area input type
        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set the input type to text area
        .execTestCase(setInputType("textarea"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //check if the aria-label attribute has been set on the textarea element
        .asserts.isTrue(function() {
            return h.find("textarea[name='" + elemName + "'][aria-label='" + label + "']",
                    "#ContentFrame").size() == 1;
        });

    /**
     * Test: Set element name
     */
    var setElementName = new h.TestCase("Set Element Name",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        .execTestCase(setMandatoryFields)
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if input name is set correctly
        .asserts.isTrue(function() {
            return h.find("input[type='text'][name='" + elemName + "']","#ContentFrame").size() == 1;
        })

        // test it also for text area
        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set the input type to text area
        .execTestCase(setInputType("textarea"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if input name is set correctly
        .asserts.isTrue(function() {
            return h.find("textarea[name='" + elemName + "']","#ContentFrame").size() == 1;
        });

    /**
     * Test: Set element value
     */
    var setValue = new h.TestCase("Set Value",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set a default value
        .fillInput("[name='./value']",defaultValue)
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if default value is set correctly
        .asserts.isTrue(function() {
            return h.find("input[type='text'][value='" + defaultValue + "']", "#ContentFrame").size() == 1;
        })

        // test it also for text area input type
        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set the input type to text area
        .execTestCase(setInputType("textarea"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if textarea default value is set correctly
        .asserts.isTrue(function() {
            return h.find("textarea[name='" + elemName + "']:contains('" + defaultValue + "')",
                    "#ContentFrame").size() == 1;
        });

    /**
     * Test : Create a text input field
     */
    var createTextInput = new h.TestCase("Create Text Input",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set the type to text
        .execTestCase(setInputType("text"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if the input is rendered correctly
        .asserts.isTrue(function() {
            return h.find("input[type='text'][name='" + elemName + "']","#ContentFrame").size() == 1;
        });

    /**
     * Test : Create a text area
     */
    var createTextarea = new h.TestCase("Create Text Area",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set the type to textarea
        .execTestCase(setInputType("textarea"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if the text area is rendered correctly
        .asserts.isTrue(function() {
            return h.find("textarea[name='" + elemName + "']","#ContentFrame").size() == 1;
        });

    /**
     * Test : Create a email input field
     */
    var createEmail = new h.TestCase("Create Email Input",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set the type to email
        .execTestCase(setInputType("email"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if the input is rendered correctly
        .asserts.isTrue(function() {
            return h.find("input[type='email'][name='" + elemName + "']","#ContentFrame").size() == 1;
        });

    /**
     * Test : Create a telephone input field
     */
    var createTel = new h.TestCase("Create Telephone Input",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set the type to tel
        .execTestCase(setInputType("tel"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if the input is rendered correctly
        .asserts.isTrue(function() {
            return h.find("input[type='tel'][name='" + elemName + "']","#ContentFrame").size() == 1;
        });

    /**
     * Test : Create a date input field
     */
    var createDate = new h.TestCase("Create Date Input",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set the type to date
        .execTestCase(setInputType("date"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if the input is rendered correctly
        .asserts.isTrue(function() {
            return h.find("input[type='date'][name='" + elemName + "']","#ContentFrame").size() == 1;
        });

    /**
     * Test : Create a number input field
     */
    var createNumber = new h.TestCase("Create Number Input",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set the type to number
        .execTestCase(setInputType("number"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if the input is rendered correctly
        .asserts.isTrue(function() {
            return h.find("input[type='number'][name='" + elemName + "']","#ContentFrame").size() == 1;
        });

    /**
     * Test : Create a password input field
     */
    var createPassword = new h.TestCase("Create Password Input",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set the type to password
        .execTestCase(setInputType("password"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if the input is rendered correctly
        .asserts.isTrue(function() {
            return h.find("input[type='password'][name='" + elemName + "']","#ContentFrame").size() == 1;
        });

    /**
     * Test : set Help message as tooltip
     */
    var setHelpMessage = new h.TestCase("Set Help Text",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // switch the tab
        .execTestCase(c.tcSwitchConfigTab(("About")))
        // set the help message
        .fillInput("input[name='./helpMessage']",helpMessage)
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if help message is rendered as a tooltip of the input field
        .asserts.isTrue(function() {
            return h.find(".cmp-form-text__help-block:contains('" + helpMessage + "') ~ input[type='text'][name='" +
                    elemName + "']",
                    "#ContentFrame").size() == 1;
        });

    /**
     * Test : set Help message as placeholder
     */
    var setHelpMessageAsPlaceholder = new h.TestCase("Set Help Text as Placeholder",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // switch the tab
        .execTestCase(c.tcSwitchConfigTab(("About")))
        // set the help message
        .fillInput("input[name='./helpMessage']",helpMessage)
        // check the 'help text as placeholder' flag
        .click("input[type='checkbox'][name='./usePlaceholder'")
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if help message is rendered as a tooltip of the input field
        .asserts.isTrue(function() {
            return h.find("input[type='text'][name='" + elemName + "'][placeholder='" + helpMessage + "']",
                    "#ContentFrame").size() == 1;
        });

    /**
     * Test: check available constraints element name
     */
    var checkAvailableConstraints = new h.TestCase("Check available Constraints",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))

        // open the dropdown
        .click("coral-select[name='./type'] button")
        // wait for the dropdown to appear
        .assert.isVisible("coral-select[name='./type'] coral-selectlist")
        // check if all the constraints are available
        // text
        .assert.isTrue(function(){
            return h.find("coral-select[name='./type'] coral-selectlist-item[value='text']").size() == 1})
        // textarea
        .assert.isTrue(function(){
            return h.find("coral-select[name='./type'] coral-selectlist-item[value='textarea']").size() == 1})
        // email,tel,date,number,password
        .assert.isTrue(function(){
            return h.find("coral-select[name='./type'] coral-selectlist-item[value='email']").size() == 1})
        // tel
        .assert.isTrue(function(){
            return h.find("coral-select[name='./type'] coral-selectlist-item[value='tel']").size() == 1})
        // date,number,password
        .assert.isTrue(function(){
            return h.find("coral-select[name='./type'] coral-selectlist-item[value='date']").size() == 1})
        // number
        .assert.isTrue(function(){
            return h.find("coral-select[name='./type'] coral-selectlist-item[value='number']").size() == 1})
        //password
        .assert.isTrue(function(){
            return h.find("coral-select[name='./type'] coral-selectlist-item[value='password']").size() == 1});

    /**
     * Test : test read only setting
     */
    var setReadOnly = new h.TestCase("Set Read Only",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // switch the tab
        .execTestCase(c.tcSwitchConfigTab(("Constraints")))
        // check the 'Make read only' flag
        .click("input[type='checkbox'][name='./readOnly'")
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if input field is set to read only
        .asserts.isTrue(function() {
            return h.find("input[type='text'][name='" + elemName + "'][readonly]", "#ContentFrame").size() == 1;
        })

        // also check text area
        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set the type to textarea
        .execTestCase(setInputType("textarea"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if input field is set to read only
        .asserts.isTrue(function() {
            return h.find("textarea[name='" + elemName + "'][readonly]", "#ContentFrame").size() == 1;
        });

    /**
     * Test : test required setting
     */
    var setRequired = new h.TestCase("Set Required",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // switch the tab
        .execTestCase(c.tcSwitchConfigTab(("Constraints")))
        // check the 'Required' flag
        .click("input[type='checkbox'][name='./required'")
        // set the required message
        .fillInput("textarea[name='./requiredMessage']",requiredMessage)
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if input field is set to read only
        .asserts.isTrue(function() {
            return h.find("input[type='text'][name='" + elemName + "'][required]", "#ContentFrame").size() == 1;
        })

        // also check text area
        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set the type to textarea
        .execTestCase(setInputType("textarea"))
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if text area field is set to read only
        .asserts.isTrue(function() {
            return h.find("textarea[name='" + elemName + "'][required]", "#ContentFrame").size() == 1;
        })

        //Check if input field is set to read only
        .asserts.isTrue(function() {
            return h.find("textarea[name='" + elemName + "'][data-cmp-required='"+requiredMessage+"']",
                    "#ContentFrame").size() == 1;
        });

    /**
     * Test : test contstraint message
     */
    var setConstraintMessage = new h.TestCase("Set Constraint Message",{
        execBefore: tcExecuteBeforeTest,
        execAfter: tcExecuteAfterTest})

        // Open the edit dialog
        .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
        // set mandatory fields
        .execTestCase(setMandatoryFields)
        // set the type to textarea
        .execTestCase(setInputType("email"))
        // switch the tab
        .execTestCase(c.tcSwitchConfigTab(("Constraints")))
        // set the required message
        .fillInput("textarea[name='./constraintMessage']",requiredMessage)
        // close the edit dialog
        .execTestCase(c.tcSaveConfigureDialog)

        //Check if input field is set to read only
        .asserts.isTrue(function() {
            return h.find("input[name='" + elemName + "'][data-cmp-constraint='"+requiredMessage+"']",
                    "#ContentFrame").size() == 1;
        });

    /**
     * The main test suite for Text Component
     */
    new h.TestSuite('Core Components - Form Text v2', {path: '/apps/core/wcm/sandbox/tests/core-components-it/v2/FormText.js',
        execBefore:c.tcExecuteBeforeTestSuite,
        execInNewWindow : false})

        .addTestCase(checkLabelMandatory)
        .addTestCase(setLabel)
        .addTestCase(hideLabel)
        .addTestCase(setElementName)
        .addTestCase(setValue)
        .addTestCase(checkAvailableConstraints)
        .addTestCase(createTextInput)
        .addTestCase(createTextarea)
        .addTestCase(createEmail)
        .addTestCase(createTel)
        .addTestCase(createDate)
        .addTestCase(createNumber)
        .addTestCase(createPassword)
        .addTestCase(setHelpMessage)
        .addTestCase(setHelpMessageAsPlaceholder)
        .addTestCase(setReadOnly)
        .addTestCase(setRequired)
        .addTestCase(setConstraintMessage)
    ;
}(hobs, jQuery));
