
jQuery(function () {
	jQuery('.category-div .btn').click(function () {
		var selectedCatergory = $(this)
		var categoryContainer = selectedCatergory.parents(".category-div");
		console.log(categoryContainer)
		jQuery(".category-div").hide()
		categoryContainer.show()
	});
	jQuery('body').on('click', '#changeCategory', function () {
		jQuery(".category-div").show()
	})

});