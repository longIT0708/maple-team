$(document).ready(function() {
  // Get file structure from server
  $.getJSON('/file-structure', function(data) {
    var fileTree = buildFileTree(data);
    $('#file-tree').append(fileTree);
  });

  // Handle folder renaming
  $('#file-tree').on('click', 'span.folder', function() {
    var folderName = $(this).text();
    var newFolderName = prompt('Enter new folder name:', folderName);
    if (newFolderName !== null) {
      $.post('/rename-folder', { oldFolderName: folderName, newFolderName: newFolderName }, function(data) {
        if (data.success) {
          location.reload();
        } else {
          alert('Error renaming folder');
        }
      });
    }
  });

  // Handle image renaming
  $('#file-tree').on('click', 'span.image', function() {
    var imageName = $(this).text();
    var newImageName = prompt('Enter new image name:', imageName);
    if (newImageName !== null) {
      $.post('/rename-image', { oldImageName: imageName, newImageName: newImageName }, function(data) {
        if (data.success) {
          location.reload();
        } else {
          alert('Error renaming image');
        }
      });
    }
  });

  // Handle folder deletion
  $('#file-tree').on('click', 'span.folder > .delete', function() {
    var folderName = $(this).siblings('.folder').text();
    if (confirm('Are you sure you want to delete folder "' + folderName + '" and all its contents?')) {
      $.post('/delete-folder', { folderName: folderName }, function(data) {
        if (data.success) {
          location.reload();
        } else {
          alert('Error deleting folder');
        }
      });
    }
  });

  // Handle image deletion
  $('#file-tree').on('click', 'span.image > .delete', function() {
    var imageName = $(this).siblings('.image').text();
    if (confirm('Are you sure you want to delete image "' + imageName + '"?')) {
      $.post('/delete-image', { imageName: imageName }, function(data) {
        if (data.success) {
          location.reload();
        } else {
          alert('Error deleting image');
        }
      });
    }
  });

  // Handle folder creation
  $('#file-tree').on('click', '#create-folder-button', function() {
  var folderName = prompt('Enter new folder name:');
  if (folderName !== null) {
  $.post('/create-folder', { folderName: folderName }, function(data) {
  if (data.success) {
  location.reload();
  } else {
  alert('Error creating folder');
  }
  });
  }
  });
  
  // Build file tree from JSON data
  function buildFileTree(data) {
  var $ul = $('<ul>');
  $.each(data, function(name, contents) {
  var $li = $('<li>');
  var $span = $('<span>');
  if (contents.type === 'folder') {
  $span.addClass('folder');
  $span.text(name);
  var $deleteButton = $('<span>');
  $deleteButton.addClass('delete');
  $deleteButton.text('Delete');
  $span.append($deleteButton);
  var $ul2 = buildFileTree(contents.contents);
  $li.append($span, $ul2);
  } else {
  $span.addClass('image');
  $span.text(name);
  var $deleteButton = $('<span>');
  $deleteButton.addClass('delete');
  $deleteButton.text('Delete');
  $span.append($deleteButton);
  $li.append($span);
  }
  $ul.append($li);
  });
  return $ul;
  }
  })    
