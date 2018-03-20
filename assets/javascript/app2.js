
jQuery(function() {
 	jQuery('.category-div .btn').click(function() {
 		var selectedCatergory = $(this)
 		var categoryContainer = selectedCatergory.parents(".category-div");
 		console.log(categoryContainer)
 		$(".category-div").hide()
 		categoryContainer.show()
  });
});