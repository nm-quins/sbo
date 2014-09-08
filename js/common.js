$(document).ready(function() {

	if($("[data-dropdown]").length)
		initializeDropdowns();
});


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