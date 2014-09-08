$(document).ready(function() {
	
	if($("[data-field]").length)
		initializeFields();
	
	if($("[data-accordion]").length)
		initializeAccordions();

	if($("[data-dropdown]").length)
		initializeDropdowns();
		
	if($("[data-tabulator]").length)
		initializeTabulators();
		
	if($("[data-field-name='order-price']").length) {
		
		$("[data-field-name='order-price']").find("[data-field-entity]").change(function () {
		
			var priceValue = $(this).val();
			var totalPrice = (priceValue == 1 ? "1 000 руб." : (priceValue == 2 ? "2 000 руб." : "5 000 руб."));
			$("[data-form-total-price]").text(totalPrice);
		});
	}
		
	if($("[data-form-target]").length) {
		
		var formTargetField = $("[data-form-target-field]");
		
		$("[data-form-target]").click(function () {
			
			$("[data-form-target]").filter(".b-form-current-target").removeClass("b-form-current-target");
			$(this).addClass("b-form-current-target");
			formTargetField.val($(this).data("form-target-value"));
			
			return false;
		});
	}
});


/* Fields */
var fields = {};
var fieldsProperties = {};

function initializeFields() {

	$("[data-field]").each(function() {
		
		var fieldID = generateIdentificator();
		var fieldDescriptor = ($(this).attr("data-field-descriptor") ? $(this).attr("data-field-descriptor") : "");
		
		fields[fieldID] = {
			
			field: $(this),
			entity: ($(this).find("[data-field-entity]").length ? $(this).find("[data-field-entity]") : null),
			repository: ($(this).parents().find("[data-field-repository]").length ? $(this).parents().find("[data-field-repository]") : null),
			properties: (fieldsProperties[fieldDescriptor] ? fieldsProperties[fieldDescriptor] : {})
		}
		
		fields[fieldID].field.attr("data-field-identificator", fieldID);
		
		switch(fieldDescriptor) {
			
			case "checkbox":
			
				fields[fieldID].field.click(function() {
					
					$(this).toggleClass("b-checked-checkbox-field");
					
					if(fields[fieldID].entity)
						fields[fieldID].entity.attr("checked", ($(this).hasClass("b-checked-checkbox-field") ? true : false));
						
					return false;
				});
			
			break;
			

			case "radio":
		
				fields[fieldID].field.click(function() {

					if(!$(this).hasClass("b-checked-radio-field")) {
					
						var currentCheckedField = $("[data-field][data-field-descriptor='radio'][data-field-name='" + $(this).data("field-name") + "'][class*='b-checked-radio-field']");
						
						if(currentCheckedField.length)
							currentCheckedField.toggleClass("b-checked-radio-field");
					
						$(this).toggleClass("b-checked-radio-field");
					
						if(fields[fieldID].entity)
							fields[fieldID].entity.prop("checked", true);
					}
				});
		
			break;
		}
		
		if(fields[fieldID].properties.initializeFunction)
			executeFunction(fields[fieldID].properties.initializeFunction, null, fieldID);
	});
}


/* Dropdowns */
var dropdowns = {};
var dropdownsSettings = {
	
	"register-legal": {
		
		initializeFunction: "initializeFilterDropdown"
	},
	"selector": {
		
		initializeFunction: "initializeFilterDropdown"
	}
};
var openedDropdown = null;

function initializeDropdowns() {
	
	$("[data-dropdown]").each(function() {
		
		var dropdownID = generateIdentificator();
		var dropdownDescriptor = ($(this).attr("data-dropdown-descriptor") ? $(this).attr("data-dropdown-descriptor") : "");
		
		dropdowns[dropdownID] = {
			
			dropdown: $(this),
			descriptor: dropdownDescriptor,
			opener: $(this).find("[data-dropdown-opener]"),
			concealment: $(this).find("[data-dropdown-concealment]"),
			options: ($(this).find("[data-dropdown-option]").length ? $(this).find("[data-dropdown-option]") : null),
			optionsRepository: $(this).find("[data-dropdown-options-repository]"),
			currentOption: $(this).find("[data-dropdown-option][data-dropdown-option-descriptor='current']"),
			properties: (dropdownsSettings[dropdownDescriptor] ? dropdownsSettings[dropdownDescriptor] : {})
		};
		
		dropdowns[dropdownID].dropdown.attr("data-dropdown-identificator", dropdownID);
		
		dropdowns[dropdownID].opener.click(function() {
			
			return toggleDropdown(dropdownID);
		});
		
		dropdowns[dropdownID].concealment.find("[data-dropdown-option-link]").click(function() {

			dropdowns[dropdownID].opener.trigger("click");
		});

		dropdowns[dropdownID].dropdown.click(function(e) {

			e.stopPropagation();
		});

		$(document).click(function() {

			if(openedDropdown && !openedDropdown.concealment.hasClass("g-hidden"))
				openedDropdown.opener.trigger("click");
		});
		
		if(dropdowns[dropdownID].properties.initializeFunction)
			executeFunction(dropdowns[dropdownID].properties.initializeFunction, null, dropdownID);
	});
}

function toggleDropdown(dropdownID) {
	
	if(dropdowns[dropdownID].concealment.hasClass("g-hidden") && openedDropdown)
		openedDropdown.opener.trigger("click");

	openedDropdown = (dropdowns[dropdownID].concealment.hasClass("g-hidden")) ? dropdowns[dropdownID] : null;

	dropdowns[dropdownID].dropdown.toggleClass("b-opened-dropdown");

	if(dropdowns[dropdownID].descriptor)
		dropdowns[dropdownID].dropdown.toggleClass("b-opened-" + dropdowns[dropdownID].descriptor + "-dropdown");
		
	dropdowns[dropdownID].concealment.toggleClass("g-hidden");
	
	return false;
}

function initializeFilterDropdown(dropdownID) {
	
	dropdowns[dropdownID].currentOptionTitleRepository = (dropdowns[dropdownID].dropdown.find("[data-dropdown-current-option-title-repository]").length ? dropdowns[dropdownID].dropdown.find("[data-dropdown-current-option-title-repository]") : dropdowns[dropdownID].opener);
	dropdowns[dropdownID].entity = (dropdowns[dropdownID].dropdown.find("[data-dropdown-entity]").length ? dropdowns[dropdownID].dropdown.find("[data-dropdown-entity]") : null);

	if(dropdowns[dropdownID].options.length) {
		
		dropdowns[dropdownID].options.each(function() {
			
			var option = $(this);

			option.find("[data-dropdown-option-link]").click(function(event) {
			
				event.preventDefault();
				console.log(event);

				if(!option.attr("data-dropdown-option-descriptor") || option.attr("data-dropdown-option-descriptor") != "current") {
					
					if(dropdowns[dropdownID].currentOption) {

						dropdowns[dropdownID].currentOption.toggleClass("b-dropdown-concealment-options-current-clause");
						dropdowns[dropdownID].currentOption.removeAttr("data-dropdown-option-descriptor");
					}

					option.toggleClass("b-dropdown-concealment-options-current-clause");
					option.attr("data-dropdown-option-descriptor", "current");
					dropdowns[dropdownID].currentOption = option;

					if(dropdowns[dropdownID].currentOptionTitleRepository)
						dropdowns[dropdownID].currentOptionTitleRepository.text(option.text());
					
					if(dropdowns[dropdownID].entity)
						dropdowns[dropdownID].entity.find("[data-dropdown-entity-clause][data-dropdown-entity-clause-value='" + option.attr("data-dropdown-option-value") + "']").prop("selected", true);
				}
				
				return false;
			});
		});
	}
}


var accordions = {}
var accordionsProperties = {
	
	"form-structure": {
		
		additionalClass: "b-form-opened-structure",
		animation: "slide"
	}
};

function initializeAccordions() {
	
	$(document).on("click", "[data-accordion-tumbler]", function() {
		
		var accordion = $(this).parents("[data-accordion]").eq(0);
		
		if(!accordion.attr("data-accordion-identificator")) {
			
			var accordionID = generateIdentificator();
			var accordionDescriptor = (accordion.attr("data-accordion-descriptor") ? accordion.attr("data-accordion-descriptor") : "");
			
			accordions[accordionID] = {
			
				accordion: accordion,
				descriptor: accordionDescriptor,
				tumbler: $(this),
				concealment: (accordion.find("[data-accordion-concealment]").length) ? accordion.find("[data-accordion-concealment]").first() : null,
				properties: (accordionsProperties[accordionDescriptor] ? accordionsProperties[accordionDescriptor] : {}) 
			}
			
			accordions[accordionID].accordion.attr("data-accordion-identificator", accordionID);
			
		} else
			accordionID = accordion.attr("data-accordion-identificator");
		
		if(accordions[accordionID].properties.additionalClass)
			accordions[accordionID].accordion.toggleClass(accordions[accordionID].properties.additionalClass);
		
		if(accordions[accordionID].properties.animation && accordions[accordionID].properties.animation == "slide") {
			
			if(accordions[accordionID].concealment.hasClass("g-hidden")) {
				
				accordions[accordionID].concealment.css("display", "none");
				accordions[accordionID].concealment.toggleClass("g-hidden");
			}
			
			accordions[accordionID].concealment.slideToggle(350);

		} else
			accordions[accordionID].concealment.toggleClass("g-hidden");
			
		if(accordions[accordionID].properties.initializeFunction)
			executeFunction(accordions[accordionID].properties.initializeFunction, null, accordionID);

		return false;
	});
}


/* Tabulators */
var tabulators = {};
var tabulatorsProperties = {
	
	"products-article": {
		
		tabsCurrentAdditionalClass: "b-tabs-current-clause"
	}
};

function initializeTabulators() {
	
	$("[data-tabulator]").each(function() {

		var tabulatorID = generateIdentificator();
		var tabulatorDescriptor = ($(this).attr("data-tabulator-descriptor") ? $(this).attr("data-tabulator-descriptor") : "");
		
		tabulators[tabulatorID] = {
			
			tabulator: $(this),
			tabs: $(this).find("[data-tabulator-tab]"),
			currentTab: null,
			tabsRepository: $(this).find("[data-tabulator-tabs-repository]"),
			scrollAnchor: $(this).find("[data-tabulator-anchor]"),
			contents: $(this).find("[data-tabulator-tab-contents]"),
			properties: (tabulatorsProperties[tabulatorDescriptor] ? tabulatorsProperties[tabulatorDescriptor] : {})
		};

		tabulators[tabulatorID].tabs.each(function() {
			
			var tab = $(this);
			var tabDescriptor = ($(this).attr("data-tabulator-tab-descriptor") ? $(this).attr("data-tabulator-tab-descriptor") : "");

			if(tabulators[tabulatorID].properties.tabsCurrentAdditionalClass && tabulators[tabulatorID].tabs.filter("." + tabulators[tabulatorID].properties.tabsCurrentAdditionalClass))
				tabulators[tabulatorID].currentTab = tabulators[tabulatorID].tabs.filter("." + tabulators[tabulatorID].properties.tabsCurrentAdditionalClass);
				
			tab.find("[data-tabulator-tab-link]").click(function() {

				if(!tabulators[tabulatorID].currentTab || (tabulators[tabulatorID].currentTab && !tab.hasClass(tabulators[tabulatorID].properties.tabsCurrentAdditionalClass))) {
					
					tabulators[tabulatorID].currentTab.toggleClass(tabulators[tabulatorID].properties.tabsCurrentAdditionalClass);
					tab.toggleClass(tabulators[tabulatorID].properties.tabsCurrentAdditionalClass);
					
					tabulators[tabulatorID].contents.not("[class*='g-hidden']").toggleClass("g-hidden");
					tabulators[tabulatorID].contents.filter("[data-tabulator-tab-contents-descriptor='" + tabDescriptor + "']").toggleClass("g-hidden");
					
					tabulators[tabulatorID].currentTab = tab;

					if (tabulators[tabulatorID].scrollAnchor.length) {

						$('html, body').animate({
							scrollTop: tabulators[tabulatorID].scrollAnchor.offset().top - ( tabulators[tabulatorID].properties.scrollOffset ? tabulators[tabulatorID].properties.scrollOffset : 0 )
						}, 1000);
					}
				}
				
				return false;
			});
			
			if(tabulators[tabulatorID].properties.initializeFunction)
				executeFunction(tabulators[tabulatorID].properties.initializeFunction, null, tabulatorID);
		});

		if(window.location.hash)
			tabulators[tabulatorID].tabulator.find("[data-tabulator-tab][data-tabulator-tab-descriptor='" + window.location.hash.substr(1) + "']").find("[data-tabulator-tab-link]").click();

		$(document).on( "click", "a[href*=#]", function(event) {

			var link = $(this).attr("href");
			if (/#[A-Za-z0-9-]+/.test(link) && link !== "#feedback") {

				event.preventDefault();
				$("[data-tabulator-tab][data-tabulator-tab-descriptor='" + link.match(/#[A-Za-z0-9-]+/)[0].substr(1) + "']").find("[data-tabulator-tab-link]").click();
			}
		});
	});
}



/* Unsorted */
function executeFunction(name, context) {
	
	var context = context ? context : window;
	var properties = Array.prototype.slice.call(arguments).splice(2, 100);
	var namespaces = name.split(".");
	var func = namespaces.pop();
	
	for(var i = 0; i < namespaces.length; i++) {
		
		context = context[namespaces[i]];
	}
	
	return context[func].apply(this, properties);
}

function getElementPercentageWidth(element) {
	
	var width = element.width();
	var parentWidth = element.offsetParent().width();
	
	return Math.ceil(100 * (width / parentWidth));
}

function getSubstring(string, substringPattern) {
	
	var searchResults = string.match(substringPattern);
	
	return ((searchResults && searchResults[1]) ? searchResults[1] : "");
}

var identificators = {};

function generateIdentificator() {

	var identificator = '';
	var identificatorLength = 10;
	var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var charsetLength = charset.length;

	for (i = 0; identificatorLength > i; i += 1) {
  
		var charIndex = Math.random() * charsetLength;  
		identificator += charset.charAt(charIndex);  
	}
	
	identificator = identificator.toLowerCase();

	if (identificators[identificator])
		return generateIdentificator();

	identificators[identificator] = true;  

	return identificator;
}